import { Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { BusinessCard } from '../models/business-card';
import { map, filter, mergeMap, mapTo, catchError, reduce, concatMap, takeUntil, toArray, first } from 'rxjs/operators';
import { Observable, Subject, of, from } from 'rxjs';
import { removeEmails, removePhoneNumbers, removePostcodes } from '../helpers/business-card/parsing';
import { LanguageService } from './language.service';
import { HistoryService } from './history.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService implements OnDestroy {

  businessCardsRef: any;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthenticationService,
    private firebaseDB: AngularFireDatabase,
    private languageService: LanguageService,
    private historyService: HistoryService) {
    this.businessCardsRef =
      this.firebaseDB.list<BusinessCard>(`businessCards/${this.authService.userUid}`);
  }

  getBusinessCards(): Observable<BusinessCard[]> {
    return this.businessCardsRef.valueChanges().pipe(
      map((businessCards: any[]) => {
        // this returns the full list of business cards. Map over each one and extract just the
        // values which is the actual business card object.
        return businessCards.map(businessCard => Object.values(businessCard).pop());
      })
    );
  }

  addBusinessCard(businessCard: BusinessCard) {
    this.businessCardsRef.push({ [businessCard.getKey()]: businessCard });
    this.historyService
      .addHistory(`add - User added business card for ${businessCard.firstName} ${businessCard.lastName}`);
  }

  parseBusinessCard(businessCardText: string): Observable<BusinessCard> {
    const businessCard = new BusinessCard();
    let text = businessCardText;
    const { emails, stringWithoutEmails } = removeEmails(text);
    if (emails && emails.length > 0) {
      businessCard.email = emails.join(', ');
    }
    text = stringWithoutEmails;
    const { phoneNumbers, stringWithoutPhoneNumbers } = removePhoneNumbers(text);
    if (phoneNumbers && phoneNumbers.length > 0) {
      businessCard.phoneNumber = phoneNumbers.join(', ');
    }
    text = stringWithoutPhoneNumbers;
    const { postalCode, stringWithoutPostalCode } = removePostcodes(text);
    text = stringWithoutPostalCode;

    return this.languageService.getRelevantStrings(text).pipe(
      mergeMap(
        (entities: any[]) => {
          let person = entities.filter(entity => entity['type'] === 'PERSON')
            .map(entity => entity['name'].toLowerCase().split(' '));
          if (person.length > 0) {
            person = person.reduce((acc, val) => acc.concat(val));
          }
          return this.getFirstAndLastName(person).pipe(takeUntil(this.unsubscribe$),
            toArray()
          );
        },
        (entities: any[], firstAndLastName: any[]) => {
          let location = '';
          for (let i = 0; i < firstAndLastName.length; i++) {
            if (businessCard.firstName && businessCard.lastName) {
              i = firstAndLastName.length + 1;
            }
            if (!businessCard.firstName && firstAndLastName[i]['first'].length > 0) {
              businessCard.firstName = firstAndLastName[i]['first'][0];
            }
            else if (!businessCard.lastName && firstAndLastName[i]['last'].length > 0) {
              businessCard.lastName = firstAndLastName[i]['last'][0];
            }
          }
          if (!businessCard.firstName && !businessCard.lastName) {
            businessCard.firstName = 'Unknown';
            businessCard.lastName = 'Unknown';
          }
          entities.forEach(entity => {
            if (entity['type'] === 'LOCATION') {
              location += ` ${entity['name']}`;
            }
          });
          businessCard.extraText = postalCode[0] ? `${location}, ${postalCode[0]}` : location;
          return businessCard;
        })
    );
  }

  // expects entity objects from google cloud natural language api
  getFirstAndLastName(names: string[]): Observable<any> {
    names.push('');
    const source = from(names);

    return source.pipe(
      map(name => {
        return name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      }),
      mergeMap(key => this.firebaseDB.object(`names/first-names/${key}`).valueChanges().pipe(
        mergeMap(
          _ => this.firebaseDB.object(`names/last-names/${key}`).valueChanges(),
          (valueFromFirst, valueFromSecond) => {
            const validName = { 'first': [], 'last': [] };
            if (valueFromFirst) {
              validName.first.push(key);
            }
            if (valueFromSecond) {
              validName.last.push(key);
            }
            return validName;
          }),
        filter(result => {
          if (key === '') {
            this.unsubscribe$.next();
          }
          return result.first.length > 0 || result.last.length > 0;
        }))));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { BusinessCard } from '../models/business-card';
import { map, filter, mergeMap, mapTo, catchError, reduce, concatMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject, of, from } from 'rxjs';
import { removeEmails, removePhoneNumbers, removePostcodes } from '../helpers/business-card/parsing';
import { LanguageService } from './language.service';
import { validateConfig } from '@angular/router/src/config';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService implements OnDestroy {

  businessCardsRef: any;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthenticationService,
    private firebaseDB: AngularFireDatabase,
    private languageService: LanguageService) {
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
          reduce((acc, val) => { acc[val['key']] = val['result']; console.log(acc); return acc; }, {})
          );
        },
        (entities: any[], firstAndLastName: any) => {
          let location = '';
          entities.forEach(entity => {
            if (entity['type'] === 'LOCATION') {
              location += ` ${entity['name']}`;
            }
          });
          // businessCard.firstName = firstAndLastName['firstName'];
          // businessCard.lastName = firstAndLastName['lastName'];
          businessCard.extraText = postalCode[0] ? `${location}, ${postalCode[0]}` : location;
          return businessCard;
        })
    );
  }

  // expects entity objects from google cloud natural language api
  getFirstAndLastName(names: string[]): Observable<any> {
    const firstAndLastNames = { firstName: 'Unknown', lastName: 'Unknown' };
     const source = from(['eric', 'sherman', '']);
     const endStream$ = new Subject();
    // return source.pipe(
      //
    //   map(name => name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')),
    //   mergeMap(strippedName => this.firebaseDB.object(`names/first-names/${strippedName}`).valueChanges()
    //     .pipe(
    //       filter(x => x !== null),
    //       mapTo(strippedName),
    //     )
    //   ),
    //   reduce((acc, value) => acc.concat(value), []),
    //   catchError(err => '')
    // );
    return source.pipe(
      map(name => {
        return name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      }),
      mergeMap(key => this.firebaseDB.object(`names/first-names/${key}`).valueChanges().pipe(
        filter (result => {
          if (key === '') {
            this.unsubscribe$.next();
          }
          return result === true;
        }),
          mapTo(key)
        )));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

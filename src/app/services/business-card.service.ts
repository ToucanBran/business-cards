import { Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { BusinessCard } from '../models/business-card';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { removeEmails, removePhoneNumbers, removePostcodes } from '../helpers/business-card/parsing';
import { LanguageService } from './language.service';

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
      map(
        (entities: any[]) => {
          let location = '';
          let person = '';
          entities.forEach(entity => {
            if (entity['type'] === 'LOCATION') {
              location += ` ${entity['name']}`;
            }
            else if (!person && entity['type'] === 'PERSON') {
              person = entity['name'];
            }
          });
          location = location.trim();
          businessCard.extraText = postalCode[0] ? `${location}, ${postalCode[0]}` : location;
          if (person) {
            businessCard.firstName = person.split(' ')[0];
            businessCard.lastName = person.split(' ')[1];
          }
          else {
            businessCard.firstName = 'Unknown';
            businessCard.lastName = 'Unknown';
          }
          return businessCard;
        })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

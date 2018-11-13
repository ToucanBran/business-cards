import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { BusinessCard } from '../models/business-card';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {

  businessCardsRef: any;
  constructor(private authService: AuthenticationService,
              private firebaseDB: AngularFireDatabase) {
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
}

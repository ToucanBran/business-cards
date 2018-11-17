import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from './authentication.service';
import { map, mergeMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { HistoryAction } from '../models/history-action';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  searchHistoryRef: any;
  constructor(private firebaseDB: AngularFireDatabase,
    private authService: AuthenticationService) {
    this.searchHistoryRef = this.firebaseDB.list(`users/${this.authService.userUid}/searches`);
  }

  addHistory(action: string) {
    this.searchHistoryRef.push({ [Date.now()]: action});
  }

  getSearchHistory(): Observable<HistoryAction[]> {
    return this.firebaseDB.list(`users/`)
      .valueChanges().pipe(
        map(users =>
          users.map(x => Object.values(x['searches'])).reduce((acc, val) => acc.concat(val), [])
            .map(history => {
              const timestamp = Object.keys(history)[0];
              const action = history[timestamp];
              return new HistoryAction(new Date(+timestamp), action);
            })
        ));
  }
}

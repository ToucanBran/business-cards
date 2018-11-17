import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
// import {switchMap} from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { AngularFireDatabase } from '@angular/fire/database';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgxAnalytics } from 'ngx-analytics';
import { gaAction, gaCategory } from '../helpers/constants/google-analytics';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState: Observable<{} | null>;

  admin: Observable<{} | null>;
  user: Observable<{} | null>;
  userUid: string;
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private ngxAnalytics: NgxAnalytics
  ) {

    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userUid = user.uid;
          return this.db.object(`users/${user.uid}`).update({ email: user.email }).then(() => {
            return this.db.object(`users/${user.uid}`).valueChanges();
          }).catch((error) => {
            console.log('ERROR UPDATING USER EMAIL');
            console.log(error);
            console.log('ERROR UPDATING USER EMAIL');
          });
        } else {
          return Observable.of(null);
        }
      }));

    this.admin = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.object(`admin/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      }));
    }

  loginWithEmail(email: string, password: string) {
    this.ngxAnalytics.eventTrack.next({
      action: gaAction.LOGIN,
      properties: {
        category: gaCategory.AUTHENTICATION,
        label: `attempted to login as ${email}`
      }});
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((auth) => {
        console.log(auth.user.uid);
        // possibly remove
        this.userUid = auth.user.uid;
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        console.log('CREATED AT');
        console.log(createdAt);
        console.log('CREATED AT');
        const sessionKey = this.db.database
          .ref(`sessions`)
          .push({
            userUid: auth.user.uid
          }).key;

        const sessionPayload: any = {
          createdAt: createdAt,
          userUid: auth.user.uid,
          currentSessionKey: sessionKey,
        };

        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${sessionKey}`] = { 'createdAt': createdAt };
        return this.db.database.ref().update(sessionPayloads);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  signOut() {
    this.ngxAnalytics.eventTrack.next({
      action: gaAction.LOGOUT,
      properties: {
        category: gaCategory.AUTHENTICATION,
        label: `${this.userUid} is logged out.`
      }});
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}

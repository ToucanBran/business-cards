import { Injectable } from '@angular/core';
import { googleApi } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  API_URL = `https://language.googleapis.com/v1beta1/documents:analyzeEntities?key=${googleApi.languageKey}`;
  constructor(private httpClient: HttpClient) { }

  getRelevantStrings(fullText: string): Observable<any[]> {
    const payload = this.constructPayload(fullText);
    // return this.httpClient.post(this.API_URL, payload).pipe(
    //   map(
    //     res => {
    //       return res['entities']
    //           .filter(entity => entity['type'] === 'LOCATION' ||
    //                             entity['type'] === 'PERSON' );
    //     }
    // ));

    return this.httpClient.post(this.API_URL, payload)
    .pipe(map(res => res['entities']));
  }

  constructPayload(fullText: string) {
    return {
      'document': {
        'type': 'PLAIN_TEXT',
        'content': fullText
      },
      'encodingType': 'UTF8'
    };
  }
}

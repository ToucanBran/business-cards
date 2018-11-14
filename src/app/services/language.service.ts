import { Injectable } from '@angular/core';
import { googleApi } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  API_URL = `https://language.googleapis.com/v1beta1/documents:analyzeEntities?key=${googleApi.languageKey}`;
  constructor(private httpClient: HttpClient) { }

  getRelevantStrings(fullText: string, requiredEntities: object) {
    const payload = this.constructPayload(fullText);
    return this.httpClient.post(this.API_URL, payload).subscribe(x => console.log(x));
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

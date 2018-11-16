import { Injectable } from '@angular/core';
import { googleApi } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './language.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class VisionService {
    API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${googleApi.visionKey}`;
    constructor(private httpClient: HttpClient) { }

    readImage(imageUri: string) {
        const payload = this.constructPayload(imageUri);
        return this.httpClient.post(this.API_URL, payload).pipe(map(res => {
            return res['responses'].map(response => {
                if (response['fullTextAnnotation']) {
                    return response['fullTextAnnotation']['text'];
                }
                else {
                  return '';
                }
            });
        }));
    }

    constructPayload(imageUri: string) {
        return {
            'requests': [
                {
                    'image': {
                        'content': imageUri
                    },
                    'features': [
                        {
                            'type': 'TEXT_DETECTION'
                        }
                    ]
                }
            ]
        };
    }
}

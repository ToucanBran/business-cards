import { Injectable } from '@angular/core';
import { googleApi } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VisionService {
  API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${googleApi.key}`;
  constructor(private httpClient: HttpClient) { }

  readImage(imageUri: string) {
    const payload = this.constructPayload(imageUri);
    return this.httpClient.post(this.API_URL, payload).subscribe(x => {
      console.log(x);
    });
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

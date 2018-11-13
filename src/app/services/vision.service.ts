import { Injectable } from '@angular/core';
import { googleApi } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisionService {
  API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${googleApi.key}`;
  constructor() { }

  readImage() {

  }
}

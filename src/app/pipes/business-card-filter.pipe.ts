import { Pipe, PipeTransform } from '@angular/core';
import { BusinessCard } from '../models/business-card';

@Pipe({
  name: 'businessCardFilter'
})
export class BusinessCardFilterPipe implements PipeTransform {

  transform(items: BusinessCard[], arg: string): any {
    if (items) {
      return items.filter(item => item.firstName.includes(arg) || item.lastName.includes(arg));
    }
  }
}

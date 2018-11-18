import { Pipe, PipeTransform } from '@angular/core';
import { BusinessCard } from '../models/business-card';

@Pipe({
  name: 'businessCardFilter'
})
export class BusinessCardFilterPipe implements PipeTransform {

  transform(items: BusinessCard[], arg: string): any {
    if (items) {
      const search = arg.toLowerCase();
      return items.filter(item => {
        return  item.firstName.toLowerCase().includes(search)
                || item.lastName.toLowerCase().includes(search);
      });
    }
  }
}

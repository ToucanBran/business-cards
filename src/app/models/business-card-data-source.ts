import { DataSource } from '@angular/cdk/table';
import { BusinessCardService } from '../services/business-card.service';
import { BusinessCard } from './business-card';
import { Observable } from 'rxjs';

export class BusinessCardDataSource extends DataSource<any> {

    constructor(private businessCardService: BusinessCardService) {
        super();
    }

    connect(): Observable<BusinessCard[]> {
        this.businessCardService.getBusinessCards().subscribe(x => {
            console.log(x);
        });
        return this.businessCardService.getBusinessCards();
    }

    disconnect() {}
}

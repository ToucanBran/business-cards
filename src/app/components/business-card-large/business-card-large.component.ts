import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BusinessCard } from '../../models/business-card';
import { BusinessCardService } from '../../services/business-card.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-business-card-large',
  templateUrl: './business-card-large.component.html',
  styleUrls: ['./business-card-large.component.css']
})
export class BusinessCardLargeComponent implements OnInit, OnDestroy {

  businessCard: BusinessCard;
  private unsubscribe$ = new Subject<void>();
  constructor(private businessCardService: BusinessCardService) { }

  ngOnInit() {
     this.businessCardService.selectedBusinessCard$.pipe(takeUntil(this.unsubscribe$))
     .subscribe(businessCard => {
       this.businessCard = businessCard;
     });
  }

  getHeightClass() {
    if (!this.businessCard) {
      return 'set-height';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

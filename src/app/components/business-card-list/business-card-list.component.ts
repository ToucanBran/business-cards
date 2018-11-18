import { Component, OnInit, OnDestroy } from '@angular/core';
import { BusinessCardService } from '../../services/business-card.service';
import { BusinessCard } from '../../models/business-card';
import { Observable, Subject } from 'rxjs';
import { BusinessCardDataSource } from '../../models/business-card-data-source';
import { MatDialog } from '@angular/material';
import { CaptureComponent } from '../capture/capture.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-business-card-list',
  templateUrl: './business-card-list.component.html',
  styleUrls: ['./business-card-list.component.css']
})
export class BusinessCardListComponent implements OnInit, OnDestroy {
  filter = '';
  dataSource = new BusinessCardDataSource(this.businessCardService);
  displayedColumns = ['firstName', 'lastName', 'phoneNumber', 'email'];
  businessCards$: Observable<BusinessCard[]>;

  private unsubscribe$ = new Subject<void>();

  constructor(private businessCardService: BusinessCardService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.businessCards$ = this.businessCardService.getBusinessCards();
  }

  openCaptureDialog() {
    const dialogRef = this.dialog.open(CaptureComponent, { });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  view(businessCard: BusinessCard) {
    this.businessCardService.selectBusinessCard(businessCard);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

import { Component, OnInit } from '@angular/core';
import { BusinessCardService } from '../../services/business-card.service';
import { BusinessCard } from '../../models/business-card';
import { Observable } from 'rxjs';
import { BusinessCardDataSource } from '../../models/business-card-data-source';

@Component({
  selector: 'app-business-card-list',
  templateUrl: './business-card-list.component.html',
  styleUrls: ['./business-card-list.component.css']
})
export class BusinessCardListComponent implements OnInit {
  filter = '';
  dataSource = new BusinessCardDataSource(this.businessCardService);
  displayedColumns = ['firstName', 'lastName', 'phoneNumber', 'email'];
  businessCards$: Observable<BusinessCard[]>;
  constructor(private businessCardService: BusinessCardService) { }

  ngOnInit() {
    this.businessCards$ = this.businessCardService.getBusinessCards();
  }



}

import { Component, OnInit, Input } from '@angular/core';
import { BusinessCard } from '../../models/business-card';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.css']
})
export class BusinessCardComponent implements OnInit {

  @Input()
  businessCard: BusinessCard;
  constructor() { }

  ngOnInit() {
  }

}

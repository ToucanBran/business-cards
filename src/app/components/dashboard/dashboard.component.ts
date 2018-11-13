import { Component, OnInit } from '@angular/core';
import { BusinessCardService } from '../../services/business-card.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(businessCardService: BusinessCardService) { }

  ngOnInit() {
  }

}

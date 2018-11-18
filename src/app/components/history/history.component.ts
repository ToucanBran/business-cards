import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { HistoryAction } from '../../models/history-action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history$: Observable<HistoryAction[]>;
  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.history$ = this.historyService.getSearchHistory();
  }

  getIconColor() {}
}

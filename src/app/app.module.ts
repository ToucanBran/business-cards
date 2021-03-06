import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { firebaseConfig } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CaptureComponent } from './components/capture/capture.component';
import { BusinessCardListComponent } from './components/business-card-list/business-card-list.component';
import {
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatTooltipModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatMenuModule
} from '@angular/material';
import { MomentModule } from 'ngx-moment';
import { NgxAnalyticsModule } from 'ngx-analytics';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BusinessCardComponent } from './components/business-card/business-card.component';
import { BusinessCardFilterPipe } from './pipes/business-card-filter.pipe';
import { HistoryComponent } from './components/history/history.component';
import { BusinessCardLargeComponent } from './components/business-card-large/business-card-large.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavigationComponent,
    CaptureComponent,
    BusinessCardListComponent,
    BusinessCardComponent,
    BusinessCardFilterPipe,
    HistoryComponent,
    BusinessCardLargeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MomentModule,
    NgxAnalyticsModule,
    MatMenuModule,
    BsDropdownModule.forRoot()
  ],
  entryComponents: [
    CaptureComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

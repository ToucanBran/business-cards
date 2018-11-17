import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxAnalyticsModule } from 'ngx-analytics';
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard';
import { AdminAuthGuard } from './guards/admin-auth-guard';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AdminAuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NgxAnalyticsModule.forRoot([NgxAnalyticsGoogleAnalytics])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
  })
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.admin.pipe(
      take(1),
      map((user) => !!user),
      tap((isAdmin) => {
        if (!isAdmin) {
          console.log('access denied');
          this.router.navigate(['']);
        }
      }),
    );
  }
}

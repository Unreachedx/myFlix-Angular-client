import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if user is authenticated (based on your auth logic, like token)
    const userToken = localStorage.getItem('token');
    
    if (userToken) {
      // If the user is authenticated, allow access
      return true;
    } else {
      // If not authenticated, redirect to the welcome page instead of login
      this.router.navigate(['welcome']);
      return false;
    }
  }
}

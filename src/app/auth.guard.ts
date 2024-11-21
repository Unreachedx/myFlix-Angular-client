import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Handle SSR
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Check authentication status in the browser
      const token = localStorage.getItem('token');
      
      if (token) {
        return true; // User is authenticated
      }
      
      // Redirect unauthenticated users to the welcome page
      this.router.navigate(['welcome']);
      return false;
    }
    
    // Block access during server-side rendering
    return false;
  }
}

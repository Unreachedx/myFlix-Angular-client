import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.authService.isLoggedIn()) {
        return true; // Allow access if logged in
      }

      this.router.navigate(['welcome']); // Redirect to 'welcome' page if not logged in
      return false;
    }

    return false; // Block access during server-side rendering
  }
}

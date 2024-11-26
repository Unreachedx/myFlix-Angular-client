import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

// Mocking isPlatformBrowser
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spies for AuthService and Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }, // Mock platform ID
      ],
    });

    // Inject the AuthGuard after configuring the testing module
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', () => {
    // Mock isPlatformBrowser to return true (simulate browser environment)
    (isPlatformBrowser as any).and.returnValue(true);

    authServiceSpy.isLoggedIn.and.returnValue(true);

    const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

    expect(guard.canActivate(mockRoute, mockState)).toBeTrue();
  });

  it('should navigate to welcome if user is not logged in', () => {
    // Mock isPlatformBrowser to return true (simulate browser environment)
    (isPlatformBrowser as any).and.returnValue(true);

    authServiceSpy.isLoggedIn.and.returnValue(false);

    const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

    expect(guard.canActivate(mockRoute, mockState)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['welcome']);
  });

  it('should block access on the server-side', () => {
    // Mock isPlatformBrowser to return false (simulate SSR environment)
    (isPlatformBrowser as any).and.returnValue(false); 

    const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

    expect(guard.canActivate(mockRoute, mockState)).toBeFalse();
  });
});

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if a token exists, false otherwise
  }
}

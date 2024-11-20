import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  logoutSuccessMessage: string | null = null;  // Property for logout message

  constructor(private router: Router) {}

  logout(): void {
    // Remove user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show the logout success message
    this.logoutSuccessMessage = 'You have successfully logged out!';

    // Redirect to the welcome page after a short delay (to display the message)
    setTimeout(() => {
      this.router.navigate(['welcome']);  // Redirect to welcome page
      this.logoutSuccessMessage = null;  // Hide message after navigating
    }, 2000);  // 2-second delay
  }
}

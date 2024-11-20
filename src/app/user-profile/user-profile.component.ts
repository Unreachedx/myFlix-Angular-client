import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  user = {
    username: '',
    email: '',
    bio: ''
  };
  isViewMode = true; // Initially, in view mode

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserLogin();
    this.getUserProfile();
  }

  /**
   * Check if the user is logged in by checking the token in localStorage
   */
  checkUserLogin(): void {
    if (!localStorage.getItem('token')) {
      // If token doesn't exist, redirect to login page
      this.router.navigate(['login']);
    }
  }

  /**
   * Fetch the user profile data
   */
  getUserProfile(): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = currentUser;
  }

  /**
   * Toggle between edit and view mode
   */
  toggleEdit(): void {
    this.isViewMode = !this.isViewMode;
  }

  /**
   * Submit the updated user data and save the changes
   */
  onSubmit(): void {
    this.fetchApiData.editUser(this.user.username, this.user).subscribe((result) => {
      console.log('User profile updated:', result);
      this.isViewMode = true; // Switch back to view mode
      // Optionally show a success message
    });
  }
}

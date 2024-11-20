import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';  // Import MatDialogRef
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';  // Import PLATFORM_ID

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    @Inject(PLATFORM_ID) private platformId: Object,  // Inject PLATFORM_ID
    @Optional() public dialogRef: MatDialogRef<LoginComponent>,  // Optional dialogRef
    public snackBar: MatSnackBar,
    private router: Router // Inject Router service here
  ) { }

  ngOnInit(): void { }

  /**
   * Function to login user using FetchApiDataService
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      // Logic for a successful login goes here
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);

      // Only close the dialog in the browser
      if (isPlatformBrowser(this.platformId)) {
        this.dialogRef?.close();  // Safely close dialog only if dialogRef exists
      }

      // Navigate to the movies page
      this.router.navigate(['movies']); // Correctly placed here

      // Show a success notification to the user
      this.snackBar.open(`Login Successful, Hello ${result.user.Username}`, 'OK', {
        duration: 2000
      });

    }, (error) => {
      // Show an error notification if login fails
      this.snackBar.open("Login unsuccessful, please try again", 'OK', {
        duration: 2000
      });
    });
  }
}

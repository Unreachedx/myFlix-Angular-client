import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<LoginComponent>,  // Dialog reference to close the dialog
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

      // Close the dialog on success!
      this.dialogRef.close();

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

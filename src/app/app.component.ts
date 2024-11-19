import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';  // Import registration form dialog
import { LoginComponent } from './login/login.component';  // Import LoginComponent

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(public dialog: MatDialog) { }

  // This is the function that will open the User Registration dialog when the signup button is clicked  
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'  // You can adjust the width as needed
    });
  }

  // This is the function that will open the Login dialog when the login button is clicked
  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px'  // You can adjust the width as needed
    });
  }
}
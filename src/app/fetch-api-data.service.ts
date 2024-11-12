import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // User Registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User Login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Get All Movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', { headers: this.getAuthHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get One Movie by Title
  public getMovie(title: string): Observable<any> {
    return this.http.get(`${apiUrl}movies/${title}`, { headers: this.getAuthHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get Director Details
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(`${apiUrl}directors/${directorName}`, { headers: this.getAuthHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get Movies by Genre
  public getGenre(genre: string): Observable<any> {
    return this.http.get(`${apiUrl}movies/genre/${genre}`, { headers: this.getAuthHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get User Details by Username
  public getUser(username: string): Observable<any> {
    return this.http.get(`${apiUrl}users/${username}`, { headers: this.getAuthHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get Favorite Movies for User
  public getFavouriteMoviesForUser(username: string): Observable<any> {
    return this.http.get(`${apiUrl}users/${username}/favorites`, { headers: this.getAuthHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Add Movie to Favorites
  public addFavouriteMovie(username: string, movieID: string): Observable<any> {
    return this.http.post(`${apiUrl}users/${username}/favorites/${movieID}`, {}, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Edit User Details
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(`${apiUrl}users/${username}`, userDetails, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete User
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(`${apiUrl}users/${username}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a Movie from Favorite Movies
  public deleteFavouriteMovie(username: string, movieID: string): Observable<any> {
    return this.http.delete(`${apiUrl}users/${username}/favorites/${movieID}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Extract Response Data
  private extractResponseData(res: Response): any {
    return res || {};
  }

  // Handle Errors
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}

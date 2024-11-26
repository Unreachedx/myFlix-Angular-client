import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Declaring the API URL
const apiUrl = 'https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {

  constructor(private http: HttpClient) {}

  /**
   * Function to register new users
   * @param userDetails 
   * @returns Observable for the signed-up user
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Function to log user in
   * @param userDetails 
   * @returns Observable for the logged-in user
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Function to get user details from localStorage
   * @returns User details
   */
  public getUser(): any {
    const user: any = JSON.parse(localStorage.getItem('user') || '');
    return {
      user
    };
  }

  /**
   * Function to edit user details
   * @param username 
   * @param userDetails 
   * @returns Observable for the edited user
   */
  public editUser(username: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to delete a user
   * @param username 
   * @returns Observable for the deleted user
   */
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get user's favorite movies
   * @param username 
   * @returns Observable for the user's favorite movies
   */
  public getUserFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username + '/movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to add a movie to favorites
   * @param username 
   * @param movieId 
   * @returns Observable for the added movie to favorites
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + `users/${username}/favorites/${movieId}`, {}, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to remove a movie from favorites
   * @param username 
   * @param movieId 
   * @returns Observable for the removed movie from favorites
   */
  public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `users/${username}/favorites/${movieId}`, {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get all movies
   * @returns Observable for all movies
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get a movie by title
   * @param movietitle 
   * @returns Observable for a movie by title
   */
  public getMovie(movietitle: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + movietitle, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get directors by name
   * @param movieDirector 
   * @returns Observable for director by name
   */
  public getMovieDirector(movieDirector: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + movieDirector, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get movies by genre
   * @param movieGenre 
   * @returns Observable for movies by genre
   */
  public getMovieGenre(movieGenre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + movieGenre, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get movie details by ID
   * @param movieId 
   * @returns Observable for movie details
   */
  public getMovieDetails(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + `movies/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Function to handle errors
   * @param error 
   * @returns error in console
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  /**
   * Function to extract response data
   * @param res 
   * @returns response data
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
}

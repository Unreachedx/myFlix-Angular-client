import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  getUserProfile: any;
  updateUserProfile(user: { username: string; email: string; bio: string; }) {
    throw new Error('Method not implemented.');
  }
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

 /**
  * Function to register new users
  * @param userDetails 
  * @returns this user signed up
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
 * @returns this user logged in
 */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * Function to get user
   * @returns this user
   */
  public getUser(): any {
    const user: any = JSON.parse(localStorage.getItem('user')|| "");
    return {
      user
    }
  }

  /**
   * Function to edit user
   * @param username 
   * @param userDetails 
   * @returns  this user edited
   */
  public editUser(username: String, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, userDetails,  {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to delete user
   * @param username 
   * @returns this user deleted
   */
  public deleteUser(username: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username ,  {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  
/**
 * Fetch the user's favorite movies.
 * @param username The username of the user.
 * @returns Observable of the user's favorite movies.
 */
public getUserFavoriteMovies(username: String): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'users/' + username + '/movies', {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    }),
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}


// Update the route from '/movies/' to '/favorites/'
public addFavoriteMovie(username: string, movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.post(apiUrl + `users/${username}/favorites/${movieId}`, {}, {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}
// Remove a movie from favorites
removeFavoriteMovie(username: string, movieId: string): Observable<any> {
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
   * @returns 
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  /**
   * Function to get all movies by title
   * @param movietitle 
   * @returns movie by title
   */
  public getMovie(movietitle: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + movietitle, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get directors by name
   * @param movieDirector 
   * @returns director by name
   */
  public getMovieDirector(movieDirector: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + movieDirector, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Function to get moviegenre
   * @param movieGenre 
   * @returns moviegenre by name
   */
  public getMovieGenre(movieGenre: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + movieGenre, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getMovieByTitle(title: string): Observable<any> {
    return this.http.get<any>(`/movies/${title}`);
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
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }
}
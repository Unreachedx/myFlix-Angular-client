import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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
  isViewMode = true;
  favorites: any[] = [];

  constructor(private router: Router, private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.checkUserLogin();
    this.getUserProfile();
    this.getFavoriteMovies(); // Load favorites from localStorage or API
  }

  checkUserLogin(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['login']);
    }
  }

  getUserProfile(): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = currentUser;
  }

  toggleEdit(): void {
    this.isViewMode = !this.isViewMode;
  }

  onSubmit(): void {
    this.fetchApiData.editUser(this.user.username, this.user).subscribe((result: any) => {
      console.log('User profile updated:', result);
      this.isViewMode = true;
    });
  }

  /**
   * Get favorite movies from localStorage or API if not found in localStorage
   */
  getFavoriteMovies(): void {
    const storedFavorites = localStorage.getItem('userFavorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      console.log('Loaded favorites from localStorage:', this.favorites);
    } else {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const username = currentUser?.username;
  
      if (username) {
        this.fetchApiData.getUserFavoriteMovies(username).subscribe({
          next: (movieIds: string[]) => {
            if (movieIds.length > 0) {
              // Prepare an array of movie requests
              const movieRequests = movieIds.map(movieId => this.fetchApiData.getMovieByTitle(movieId));
  
              // Use forkJoin to wait for all movie details to be fetched
              forkJoin(movieRequests).subscribe({
                next: (movies: any[]) => {
                  this.favorites = movies;  // All movies have been fetched
                  console.log('Fetched all favorite movies:', this.favorites);
                  // Store the fetched favorites in localStorage
                  localStorage.setItem('userFavorites', JSON.stringify(this.favorites));
                },
                error: (error) => {
                  console.error('Error fetching movie details:', error);
                }
              });
            } else {
              console.log('No favorite movies found');
            }
          },
          error: (error) => {
            console.error('Error fetching favorite movie IDs:', error);
          }
        });
      }
    }
  }
  

  toggleFavorite(movieId: string): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const username = currentUser?.Username;

    if (this.isMovieFavorite(movieId)) {
      // Remove from favorites
      this.fetchApiData.removeFavoriteMovie(username, movieId).subscribe(
        (response: any) => {
          console.log('Removed from favorites:', response);
          // Refresh the favorite movies list
          this.getFavoriteMovies();
        },
        (error: any) => {
          console.error('Error removing from favorites:', error);
        }
      );
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(username, movieId).subscribe(
        (response: any) => {
          console.log('Added to favorites:', response);
          // Refresh the favorite movies list
          this.getFavoriteMovies();
        },
        (error: any) => {
          console.error('Error adding to favorites:', error);
        }
      );
    }
  }

  isMovieFavorite(movieId: string): boolean {
    return this.favorites.some((movie) => movie._id === movieId);
  }
}
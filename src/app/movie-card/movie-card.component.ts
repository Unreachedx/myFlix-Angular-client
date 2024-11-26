import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  userFavorites: string[] = []; // Store the user's favorite movie IDs

  constructor(
    private fetchApiData: FetchApiDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadUserFavorites(); // Load user favorites from localStorage
  }

  /**
   * Load all movies from the API
   */
  private loadMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (data: any) => {
        console.log('Fetched movies data:', data);
        this.movies = data;
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  /**
   * Load the user's favorite movies from localStorage or API
   */
  private loadUserFavorites(): void {
    const storedFavorites = localStorage.getItem('userFavorites');
    if (storedFavorites) {
      // If favorites exist in localStorage, use them
      this.userFavorites = JSON.parse(storedFavorites);
      console.log('Loaded user favorites from localStorage:', this.userFavorites);
    } else {
      // Fetch favorites from API if not in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!currentUser || !currentUser.Username) {
        console.error('No user found in localStorage. Please log in.');
        alert('You are not logged in. Please log in to view your favorites.');
        return;
      }

      const username = currentUser.Username;
      if (username) {
        this.fetchApiData.getUserFavoriteMovies(username).subscribe(
          (data: string[]) => {
            console.log('User favorites fetched from API:', data);
            this.userFavorites = data; // Save favorite movie IDs
            // Store fetched favorites in localStorage for future use
            localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));
          },
          (error) => {
            console.error('Error fetching user favorites from API:', error);
          }
        );
      }
    }
  }

  /**
   * Check if a movie is in the user's favorites (based on movie ID)
   */
  isFavorite(movieId: string): boolean {
    return this.userFavorites.includes(movieId);
  }

  /**
   * Open the movie detail dialog
   */
  openMovieDetailDialog(movie: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: movie?.title || 'Unknown Title',
        genre: movie?.genre || 'Unknown Genre',
        description: movie?.description || 'No description available',
        director: movie?.director?.name || 'Unknown Director',
      },
    });
  }

  /**
   * Add a movie to the user's favorites and update localStorage
   */
  addToFavorites(movie: any): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const username = currentUser?.Username; // Corrected field

    if (!username) {
      console.error('No username found in local storage. Please log in.');
      alert('Please log in first to add a movie to favorites.');
      return;
    }

    this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe(
      (response) => {
        console.log('Movie added to favorites:', response);
        // Immediately update the local favorites list and localStorage
        this.userFavorites.push(movie._id);
        localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));
      },
      (error) => {
        console.error('Error adding movie to favorites:', error);
      }
    );
  }

  /**
   * Remove a movie from the user's favorites and update localStorage
   */
  removeFromFavorites(movie: any): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const username = currentUser?.Username; // Corrected field

    if (!username) {
      console.error('No username found in local storage. Please log in.');
      alert('Please log in first to remove a movie from favorites.');
      return;
    }

    this.fetchApiData.removeFavoriteMovie(username, movie._id).subscribe(
      (response) => {
        console.log('Movie removed from favorites:', response);
        // Update the local favorites list and localStorage
        this.userFavorites = this.userFavorites.filter((id) => id !== movie._id);
        localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));
      },
      (error) => {
        console.error('Error removing movie from favorites:', error);
      }
    );
  }

  /**
   * Toggle the favorite status of a movie (add/remove)
   */
  toggleFavorite(movie: any): void {
    if (this.isFavorite(movie._id)) {
      // If the movie is already a favorite, remove it
      this.removeFromFavorites(movie);
    } else {
      // If the movie is not a favorite, add it
      this.addToFavorites(movie);
    }
  }
}

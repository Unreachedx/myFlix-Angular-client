import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  userFavorites: string[] = []; // Store the user's favorite movies

  constructor(
    private fetchApiData: FetchApiDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadUserFavorites(); // Load user favorites from localStorage or API
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
      // If there are favorites in localStorage, use them
      this.userFavorites = JSON.parse(storedFavorites);
      console.log('Loaded user favorites from localStorage:', this.userFavorites);
    } else {
      // If no favorites in localStorage, fetch them from the API
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const username = currentUser.username;

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
   * Check if a movie is in the user's favorites
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
   * Add a movie to the user's favorites
   */
  addToFavorites(movie: any): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const username = currentUser?.Username; // Ensure the correct case for 'Username'

    if (!username) {
      console.error('No username found in local storage. Please log in.');
      alert('Please log in first to add a movie to favorites.');
      return; // Prevent API call if no username
    }

    this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe(
      (response) => {
        console.log('Movie added to favorites:', response);
        // Update the local list immediately
        this.userFavorites.push(movie._id);

        // Store updated favorite list in localStorage
        localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));

        // Optionally, you can also update the profile directly by triggering a refresh
      },
      (error) => {
        console.error('Error adding movie to favorites:', error);
      }
    );
  }

  /**
   * Toggle the favorite status of a movie (add/remove)
   */
  toggleFavorite(movie: any): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const username = currentUser?.Username; // Ensure the correct case for 'Username'

    if (!username) {
      console.error('No username found in local storage. Please log in.');
      alert('Please log in first to toggle movie favorites.');
      return;
    }

    if (this.isFavorite(movie._id)) {
      // Remove from favorites
      this.fetchApiData.removeFavoriteMovie(username, movie._id).subscribe(
        (response) => {
          console.log('Movie removed from favorites:', response);
          this.userFavorites = this.userFavorites.filter((id) => id !== movie._id); // Remove from the local list

          // Update localStorage
          localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));
        },
        (error) => {
          console.error('Error removing movie from favorites:', error);
        }
      );
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe(
        (response) => {
          console.log('Movie added to favorites:', response);
          this.userFavorites.push(movie._id); // Add to the local list

          // Update localStorage
          localStorage.setItem('userFavorites', JSON.stringify(this.userFavorites));
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
        }
      );
    }
  }
}

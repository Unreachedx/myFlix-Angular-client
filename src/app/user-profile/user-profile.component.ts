import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user = {
    username: '',
    email: '',
    bio: '',
  };
  favorites: any[] = []; // Store movie details (id, title)
  isViewMode = true;
  favoritesLoading = false; // Flag for loading state

  constructor(private fetchApiData: FetchApiDataService, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  /**
   * Fetch user profile and favorites
   */
  getUserProfile(): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser || !currentUser.Username) {
      this.router.navigate(['login']);
    } else {
      this.user = currentUser;
      this.getFavorites(); // Get the favorite movie IDs from localStorage
    }
  }

  /**
   * Fetch user's favorite movies based on movieIds from localStorage
   */
  getFavorites(): void {
    const storedFavorites = localStorage.getItem('userFavorites');
    if (storedFavorites) {
      const movieIds = JSON.parse(storedFavorites); // Array of movie IDs
      this.favorites = []; // Clear existing favorite titles
      this.favoritesLoading = true; // Start loading

      // Fetch movie details for each movieId to display titles
      movieIds.forEach((movieId: string) => {
        this.fetchApiData.getMovieDetails(movieId).subscribe(
          (movie) => {
            this.favorites.push(movie); // Add movie object (not just title) to the list
          },
          (error) => {
            console.error('Error fetching movie details:', error);
          },
          () => {
            // Once all favorite movies are fetched, set loading to false
            this.favoritesLoading = false;
          }
        );
      });
      console.log('Loaded user favorites from localStorage:', this.favorites);
    } else {
      console.log('No favorites found in localStorage');
      this.favoritesLoading = false;
    }
  }

  /**
   * Add a movie to favorites and update localStorage
   */
  addFavorite(movieId: string, movieTitle: string): void {
    let storedFavorites = localStorage.getItem('userFavorites');
    let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];

    // Prevent duplicate favorites
    if (!favoritesArray.includes(movieId)) {
      favoritesArray.push(movieId);
      localStorage.setItem('userFavorites', JSON.stringify(favoritesArray));
      this.favorites.push({ _id: movieId, title: movieTitle }); // Add to the favorites list in UI
      console.log('Movie added to favorites:', movieTitle);
    } else {
      console.log('Movie already in favorites:', movieTitle);
    }
  }

  /**
   * Remove a movie from favorites and update localStorage
   */
  removeFavorite(movieId: string, movieTitle: string): void {
    let storedFavorites = localStorage.getItem('userFavorites');
    if (storedFavorites) {
      let favoritesArray = JSON.parse(storedFavorites);
      const movieIndex = favoritesArray.indexOf(movieId);
      if (movieIndex !== -1) {
        favoritesArray.splice(movieIndex, 1); // Remove movieId from array
        localStorage.setItem('userFavorites', JSON.stringify(favoritesArray));

        // Also remove from UI favorites list
        this.favorites = this.favorites.filter((movie) => movie._id !== movieId);

        console.log('Movie removed from favorites:', movieTitle);
      }
    }
  }

  /**
   * Toggle between view and edit mode
   */
  toggleEdit(): void {
    this.isViewMode = !this.isViewMode;
  }

  /**
   * Update user profile on submit
   */
  onSubmit(): void {
    this.fetchApiData.editUser(this.user.username, this.user).subscribe({
      next: (result: any) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.isViewMode = true;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile. Please try again.');
      },
    });
  }
}

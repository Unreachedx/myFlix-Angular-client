import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchApiData.getAllMovies().subscribe((data: any) => {
      console.log('Fetched movies data:', data);
      this.movies = data;
    });
  }

  openMovieDetailDialog(movie: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: movie?.title || 'Unknown Title',
        genre: movie?.genre || 'Unknown Genre',
        description: movie?.description || 'No description available',
        director: movie?.director?.name || 'Unknown Director'
      }
    });
  }

  addToFavorites(movie: any): void {
    console.log('Added to favorites:', movie);
    // Implement your logic to handle adding to favorites
  }
}
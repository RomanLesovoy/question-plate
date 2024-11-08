import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { UserData, UserStats } from './types';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserData | null = null;
  userStats: UserStats[] = [];
  errorMessage: string | null = null;

  constructor(public readonly profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.profileService.getProfileData()
    .pipe(
      catchError(error => {
        this.setErrorMessage(error);
        return of(null);
      })
    )
    .subscribe({
      next: profile => {
        this.user = profile?.user || null;
        this.userStats = profile?.statistics || [];
      },
      error: (error: any) => this.setErrorMessage(error),
    });
  }

  private setErrorMessage(error: any) {
    this.errorMessage = error?.message || 'Error loading profile data';
    console.error(error);
  }

  getProgressPercentage(correct: number, total: number): number {
    return total > 0 ? (correct / total) * 100 : 0;
  }
}

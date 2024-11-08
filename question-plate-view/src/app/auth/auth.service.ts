import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDto, RegisterDto, AuthResponse } from './types/dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly storageKey = 'token';
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isAuthenticated$ = this.isAuthenticated.asObservable();
  public isLoading$ = this.isLoading.asObservable();
  public errorMessage$ = this.errorMessage.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem(this.storageKey);
    this.isAuthenticated.next(!!token);
  }

  login(credentials: LoginDto) {
    this.isLoading.next(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        finalize(() => this.isLoading.next(false))
      ).subscribe(
        {
          next: response => this.authenticate(response.access_token),
          error: error => {
            this.errorMessage.next(error?.message || 'Authentication error');
            console.error('Error during login:', error);
          },
        }
      );
  }

  register(userData: RegisterDto) {
    this.isLoading.next(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        finalize(() => this.isLoading.next(false))
      ).subscribe(
        {
          next: response => this.authenticate(response.access_token),
          error: error => {
            this.errorMessage.next(error?.message || 'Registration error');
            console.error('Error during registration:', error);
          },
        }
      );
  }

  private authenticate(token: string) {
    localStorage.setItem(this.storageKey, token);
    this.isAuthenticated.next(true);

    // Delay navigation to avoid race condition (renders loader)
    setTimeout(() => {
      this.router.navigate(['/user']);
    }, 100);
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.isAuthenticated.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }
}

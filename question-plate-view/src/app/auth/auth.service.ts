import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDto, RegisterDto, AuthResponse } from './types/dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private storageKey = 'token';
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem(this.storageKey);
    this.isAuthenticatedSubject.next(!!token);
  }

  login(credentials: LoginDto) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap({
          next: response => {
            localStorage.setItem(this.storageKey, response.access_token);
            this.isAuthenticatedSubject.next(true);
          },
          error: error => {
            console.error('Error during login:', error);
          }
        }),
      );
  }

  register(userData: RegisterDto) {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap({
          next: response => {
            localStorage.setItem(this.storageKey, response.access_token);
            this.isAuthenticatedSubject.next(true);
          },
          error: error => {
            console.error('Error during registration:', error);
          }
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }
}

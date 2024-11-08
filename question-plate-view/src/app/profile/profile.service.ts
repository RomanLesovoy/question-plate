import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuestionStatsRespose, UserData, UserStats } from './types';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly errorMessage: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public readonly errorMessage$ = this.errorMessage.asObservable();
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this.isLoading.asObservable();

  constructor(private http: HttpClient) {}

  getProfileData(): Observable<{ user: UserData, statistics: UserStats[] }> {
    this.isLoading.next(true);

    return forkJoin({
      user: this.http.get<any>(`${environment.apiUrl}/users/current-user`),
      answeredQuestions: this.http.get<any>(`${environment.apiUrl}/questions/answered-questions`)
    }).pipe(
      map(({ user, answeredQuestions }: { user: UserData, answeredQuestions: QuestionStatsRespose[] }) => {
        const stats = this.processStats(answeredQuestions);
        return {
          user,
          statistics: stats
        };
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  private processStats(questions: QuestionStatsRespose[]): UserStats[] {
    const statsByCategory = questions.reduce((acc, q) => {
      const key = `category_${q.category_id}`;
      if (!acc[key]) {
        acc[key] = {
          categoryId: q.category_id,
          categoryName: q.category_name,
          total: 0,
          correct: 0
        };
      }
      acc[key].total++;
      if (q.is_correct) acc[key].correct++;
      return acc;
    }, {} as Record<string, UserStats>);

    return Object.values(statsByCategory);
  }
}

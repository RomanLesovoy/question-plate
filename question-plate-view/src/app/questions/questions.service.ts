import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { QuestionDto, QuestionApiParams, Category, AnsweredQuestionResponse, AnswerQuestionParams, QuestionType } from './dto';
import { BehaviorSubject, filter, tap, switchMap } from 'rxjs';
import { EventEmitterSingleton } from '@js-emitter/event-emitter-light';
@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private readonly API_URL = `${environment.apiUrl}/questions`;
  private currentQuestionIndex: number = 0;

  private readonly categories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  private readonly questions: BehaviorSubject<QuestionDto[]> = new BehaviorSubject<QuestionDto[]>([]);
  private readonly currentCategory: BehaviorSubject<Category | null> = new BehaviorSubject<Category | null>(null);
  private readonly currentQuestion: BehaviorSubject<QuestionDto | null> = new BehaviorSubject<QuestionDto | null>(null);

  public readonly categories$ = this.categories.asObservable().pipe(filter(Boolean));
  public readonly questions$ = this.questions.asObservable().pipe(filter(Boolean));
  public readonly currentCategory$ = this.currentCategory.asObservable().pipe(filter(Boolean));
  public readonly currentQuestion$ = this.currentQuestion.asObservable().pipe(filter(Boolean));

  constructor(private readonly http: HttpClient) {
    const emitter = new EventEmitterSingleton();

    this.getCategories$().subscribe(categories => {
      this.categories.next(categories);
    });

    this.currentCategory$.pipe(
      tap(category => emitter.emit('topic', category?.name)),
      switchMap(category => this.getQuestions$({ category: category?.id })),
      tap(questions => {
        this.questions.next(questions)
        this.currentQuestion.next(questions[0])
        this.currentQuestionIndex = 0;
      }),
    ).subscribe();
  }

  getQuestions$(params: QuestionApiParams) {
    const httpParams = {
      params: params as { [key: string]: string | number | boolean | (string | number | boolean)[] }
    };
    return this.http.get<QuestionDto[]>(`${this.API_URL}`, httpParams);
  }

  answerQuestion$(params: AnswerQuestionParams) {
    return this.http.post<AnsweredQuestionResponse>(`${this.API_URL}/answer`, params).pipe(
      tap((r) => console.log(r)),
    );
  }

  nextQuestion() {
    if (!this.isNextQuestionAvailable()) {
      throw new Error('No next question available');
    }

    this.currentQuestionIndex++;
    this.currentQuestion.next(this.getQuestions()[this.currentQuestionIndex]);
  }

  isNextQuestionAvailable() {
    return this.currentQuestionIndex < this.getQuestions().length - 1;
  }

  // getAnsweredQuestions() {
  //   return this.http.get(`${this.API_URL}/answered`);
  // }

  getCategories$() {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  setCurrentCategory(category: Category) {
    this.currentCategory.next(category);
  }

  private getQuestions() {
    return this.questions.getValue();
  }
}

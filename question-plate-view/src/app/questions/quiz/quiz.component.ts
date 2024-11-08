import { Component } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  public errorMessage$: Observable<string | null>;

  constructor(public readonly questionsService: QuestionsService) {
    this.errorMessage$ = this.questionsService.errorMessage$;
  }
}

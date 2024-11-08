import { Component, DestroyRef, OnInit } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { QuestionDto, QuestionType } from '../../dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  currentQuestion: QuestionDto | null = null;
  currentCategory: number | null = null;
  questionType = QuestionType;
  result: { is_correct: boolean, correct_answer: string } | null = null;

  constructor(
    public readonly questionsService: QuestionsService,
    private readonly destroy$: DestroyRef,
  ) {}

  ngOnInit() {
    this.questionsService.currentQuestion$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(question => {
        this.currentQuestion = question;
        this.result = null;
      });

    this.questionsService.currentCategory$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(category => {
        this.currentCategory = category?.id || null;
      });
  }

  toCategories() {
    this.questionsService.resetQuiz();
  }

  nextQuestion() {
    this.questionsService.nextQuestion();
  }

  answer(answer: boolean | string) {
    if (!this.currentQuestion || !this.currentCategory) return;

    const sub = this.questionsService.answerQuestion$({
      categoryId: this.currentCategory,
      question: this.currentQuestion.question,
      correctAnswerHash: this.currentQuestion.correct_answer_hash,
      categoryName: this.currentQuestion.category,
      answer,
    }).subscribe(result => {
      this.result = result as any;

      sub.unsubscribe();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { QuestionDto, QuestionType } from '../../dto';

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

  constructor(private readonly questionsService: QuestionsService) {}

  ngOnInit() {
    this.questionsService.currentQuestion$.subscribe(question => {
      this.currentQuestion = question;
      this.result = null;
    });

    this.questionsService.currentCategory$.subscribe(category => {
      this.currentCategory = category?.id || null;
    });
  }

  answer(answer: boolean | string) {
    if (!this.currentQuestion || !this.currentCategory) return;

    this.questionsService.answerQuestion$({
      categoryId: this.currentCategory,
      question: this.currentQuestion.question,
      correctAnswerHash: this.currentQuestion.correct_answer_hash,
      answer,
    }).subscribe(result => {
      this.result = result as any;
    });
  }
}

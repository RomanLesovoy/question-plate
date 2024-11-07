import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QuestionsRoutingModule } from './questions-routing.module';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionsService } from './questions.service';
import { CategoriesComponent } from './quiz/categories/categories.component';
import { QuestionComponent } from './quiz/question/question.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    QuestionsRoutingModule,
  ],
  declarations: [
    QuizComponent,
    CategoriesComponent,
    QuestionComponent
  ],
  exports: [
    QuizComponent,
    CategoriesComponent,
    QuestionComponent
  ],
  providers: [
    QuestionsService
  ]
})
export class QuestionsModule { }

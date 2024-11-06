import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { RatingComponent } from './rating/rating.component';

const routes: Routes = [
  {
    path: 'quiz',
    component: QuizComponent,
    title: 'Викторина'
  },
  // {
  //   path: 'rating',
  //   component: RatingComponent,
  //   title: 'Рейтинг'
  // },
  {
    path: '',
    redirectTo: 'quiz',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }

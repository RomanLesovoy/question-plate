import { Component } from '@angular/core';
import { QuestionsService } from '../../questions.service';
import { Category } from '../../dto';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  constructor(public readonly questionsService: QuestionsService) {}

  public selectCategory(category: Category) {
    this.questionsService.setCurrentCategory(category);
  }
}

import { Component } from '@angular/core';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  constructor(private readonly questionsService: QuestionsService) {}
}

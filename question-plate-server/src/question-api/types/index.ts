export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuestionType {
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean'
}

export interface QuestionApiParams {
  amount?: number;
  category?: number;
  difficulty?: QuestionDifficulty;
  type?: QuestionType;
}

export interface Category {
  id: number;
  name: string;
}

// Probably not needed
// export interface CategoryAmount {
//   total_questions: number;
//   total_easy_questions: number;
//   total_medium_questions: number;
//   total_hard_questions: number;
// }

export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuestionDto {
  correct_answer_hash: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
}

export interface QuestionsResponse {
  response_code: number;
  results: Question[];
}

export interface AnsweredQuestion {
  user_id: number;
  question: string;
  category_id: number;
  correct_answer_hash: string;
}

// Probably not needed
// export interface AnsweredQuestionDto extends AnsweredQuestion {
//   is_correct: boolean;
// }

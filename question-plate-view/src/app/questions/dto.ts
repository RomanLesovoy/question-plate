export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuestionType {
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean'
}

export interface Category {
  id: number;
  name: string;
}

export interface QuestionDto {
  answers: string[] | null;
  correct_answer_hash: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
}

export interface QuestionApiParams {
  amount?: number;
  category?: number;
  difficulty?: QuestionDifficulty;
  type?: QuestionType;
}

export interface AnswerQuestionParams {
  categoryId: number;
  question: string;
  categoryName: string;
  correctAnswerHash: string;
  answer: string | boolean;
}

export interface AnsweredQuestionResponse {
  is_correct: boolean;
  answered_before: boolean;
  correct_answer: string;
}
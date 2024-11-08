export interface UserData {
  email: string;
  points: number;
  created_at: Date;
  last_login: Date;
}

export interface QuestionStatsRespose {
  category_id: number;
  category_name: string;
  is_correct: boolean;
}

export interface UserStats {
  categoryId: number;
  categoryName: string;
  total: number;
  correct: number;
}

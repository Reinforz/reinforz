export interface QuizInputPartial {
  title: string,
  subject: string,
  source?: string,
  image?: string,
  description?: string,
  questions: QuestionInputsPartial
}

export interface QuizInputFull extends Required<QuizInputPartial> {
  title: string,
  questions: QuestionInputsFull
}

export type QuestionType = 'text' | 'markdown' | 'html';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuestionInputPartial {
  question: string,
  type: QuestionType,
  image?: string,
  weight?: number,
  add_to_score?: boolean,
  time_allocated?: number,
  difficulty?: Difficulty,
  answers: string[],
  options: string[],
  correct_answer_message?: string,
  incorrect_answer_message?: string,
  explanation?: string
}

export type QuestionInputFull = Required<QuestionInputPartial>

export type QuestionInputsPartial = QuestionInputPartial[];
export type QuestionInputsFull = QuestionInputFull[];
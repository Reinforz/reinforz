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

export type QuestionType = 'MCQ' | 'MS' | 'FIB' | 'Snippet';
export type QuestionFormat = 'text' | 'markdown' | 'html';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuestionInputCommon {
  question: string,
  options?: string[],
  answers: (number | string)[],
}

export interface QuestionInput {
  type?: QuestionType,
  format?: QuestionFormat,
  image?: string,
  weight?: number,
  add_to_score?: boolean,
  time_allocated?: number,
  difficulty?: Difficulty,
  correct_answer_message?: string,
  incorrect_answer_message?: string,
  explanation?: string,
  key?: string
}

export interface QuestionInputPartial extends QuestionInputCommon, Partial<QuestionInput> { }

export type QuestionInputKeys = Array<keyof QuestionInputPartial>;

export interface QuestionInputFull extends Required<QuestionInput>, QuestionInputCommon { }

export type QuestionInputsPartial = QuestionInputPartial[];
export type QuestionInputsFull = QuestionInputFull[];
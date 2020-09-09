import { ReactNode } from "react";
import { TypeBackground } from "@material-ui/core/styles/createPalette";

export interface QuizInputPartial {
  title: string,
  subject: string,
  source?: string,
  image?: string,
  explanation?: string,
  questions: QuestionInputsPartial,
  _id: string,
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
  answers: string[],
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
  _id?: string,
  total?: number,
  index?: number
  hints?: string[],
  changeCounter: any,
  results: Result[],
  quiz: string,
  subject: string,
}

export interface QuestionInputPartial extends QuestionInputCommon, Partial<QuestionInput> { }

export type QuestionInputKeys = Array<keyof QuestionInputPartial>;

export interface QuestionInputFull extends Required<QuestionInput>, QuestionInputCommon { }

export type QuestionInputsPartial = QuestionInputPartial[];
export type QuestionInputsFull = QuestionInputFull[];

export interface Result {
  user_answers: string[],
  verdict: boolean,
  score: number,
  add_to_score: boolean,
  answers: string[],
  question: string,
  type: QuestionType,
  time_allocated: number,
  time_taken: number,
  explanation: string,
  hints_used: number,
  _id: string
}

export interface TimerRProps {
  timer: ReactNode,
  currentTime: number,
  clearInterval: any
}

export interface IPlayOptions {
  shuffle_options: boolean,
  shuffle_quizzes: boolean,
  shuffle_questions: boolean,
  instant_feedback: boolean,
  flatten_mix: boolean,
}

export interface IPlayFilters {
  time_allocated: [number, number],
  excluded_difficulty: Difficulty[],
  excluded_types: QuestionType[],
}

export interface IPlaySettingsState {
  play_options: IPlayOptions,
  play_filters: IPlayFilters,
}

export interface PlaySettingsRProps {
  PlaySettings: JSX.Element,
  play_state: IPlaySettingsState,
}

export interface ExtendedTypeBackground extends TypeBackground {
  dark: string[],
  main: string[],
  light: string[],
}

export interface HintsRProps {
  hints_state: {
    hints_used: number
  },
  HintsButton: JSX.Element,
  HintsList: JSX.Element,
}

export interface ListRProps {
  ListComponent: JSX.Element,
  list_state: {
    selectedItems: string[]
  },
  list_manips: {
    setSelectedItems: (items: any[]) => void
  }
}

export interface ReportFilterState {
  time_taken: [number, number],
  verdict: 'correct' | 'incorrect' | 'mixed',
  hints_used: number | 'any',
  excluded_types: QuestionType[],
  excluded_difficulty: Difficulty[]
}

export interface ReportFilterRProps {
  report_filter_state: ReportFilterState,
  ReportFilter: JSX.Element
}
import { Language } from "prism-react-renderer";
import { ThemeOptions, Theme } from '@material-ui/core/styles';
import { PlaySettingsOptionsState } from "./components/Play/Settings/Options/types";

// Basic Components

export type ListAction = "add" | "remove";

export interface DragItem {
  index: number
  id: string
  type: string
}

export interface StatsProps {
  item: any,
  stats: (string | undefined)[],
};

export interface QuizInputPartial extends QuizIdentifiers {
  source?: string,
  image?: string,
  explanation?: string,
  questions: QuestionInputsPartial,
}

export interface QuizInputFull extends Required<QuizInputPartial> {
  title: string,
  questions: QuestionInputsFull
}

export type QuestionType = 'MCQ' | 'MS' | 'FIB' | 'Snippet';
export type QuestionFormat = 'text' | 'code';
export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuestionInputCommon {
  question: string,
  // Options for the answers, only required for MCQ and MS types
  options?: string[],
}

export interface QuestionInput {
  // Question Type, inferred from answers and options
  type?: QuestionType,
  // Question Format, inferred from the question itself
  format?: QuestionFormat,
  // Image to use alongside the questions
  image?: string,
  // Weight of the question range 0 - 1, 0 to indicate it wont effect score 
  weight?: number,
  // Time allocated for the qustion, range 10 - 60
  time_allocated?: number,
  // Difficulty of the question, out of range gets converted to Beginner
  difficulty?: QuestionDifficulty,
  // Explanation of the answer
  explanation?: string,
  // Hints provided for the question, max 3
  hints?: string[],
  // Question language, only applicable for code format, inferred from question 
  language?: Language,
  // Unique Id of the question, created if not provided
  _id?: string,
}

export interface QuestionInputPartial extends QuestionInputCommon, Partial<QuestionInput> {
  answers: string | string[]
}

export type QuestionInputKeys = Array<keyof QuestionInputPartial>;

export interface QuestionInputFull extends Required<QuestionInput & { quiz: QuizIdentifiers }>, QuestionInputCommon {
  answers: string[]
}

export type QuestionInputsPartial = QuestionInputPartial[];
export type QuestionInputsFull = QuestionInputFull[];

export interface QuizIdentifiers {
  title: string,
  _id: string,
  subject: string
}

export interface QuizProps {
  all_questions: QuestionInputFull[],
  play_options: PlaySettingsOptionsState,
  selected_quizzes: QuizIdentifiers[]
}

export type AnswerModifier = "IS" | "IC"

export type IQuestionAnswerModifiers = Array<Array<string> | null>
export interface IQuestionAnswerNode {
  answers: Record<string, string>,
}

export type QuestionAnswersNodes = Array<IQuestionAnswerNode>
export type QuestionAnswersType = string | string[];

export interface Result {
  user_answers: string[],
  verdict: boolean,
  score: number,
  answers: string[],
  question: string,
  type: QuestionType,
  time_allocated: number,
  time_taken: number,
  explanation: string,
  hints_used: number,
  difficulty: QuestionDifficulty,
  _id: string,
  question_id: string,
  quiz: string,
  subject: string,
  quizId: string,
  weight: number
}

type color = {
  dark: string,
  base: string,
  light: string,
  opposite_dark: string,
  opposite_base: string,
  opposite_light: string
}

export interface ExtendedThemeOptions extends ThemeOptions {
  color: color
}

export interface ExtendedTheme extends Theme {
  color: color
}

export type AllowedTheme = "dark" | "light"

export interface MenuProps {
  initial_position?: "left" | "right",
  initial_open?: boolean,
  children: any,
  width?: number,
  lskey: string,
  content: JSX.Element
}

export interface MenuRenderProps {
  MenuComponent: JSX.Element,
  MenuExtra: {
    content_elem_style: any
  }
}

export interface ToggleItemsRenderProps {
  ToggleButton: JSX.Element,
  ToggleItems: JSX.Element,
  ToggleItemsUtils: {
    getNextIndex: () => void
  },
  ToggleItemsState: {
    current_index: number,
    is_disabled: boolean
  }
}
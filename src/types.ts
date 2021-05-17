import { Theme, ThemeOptions } from '@material-ui/core/styles';
import { Language } from "prism-react-renderer";

// Basic Components

export type ListAction = "add" | "remove";

interface Table_RowsCommonProps {
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  title?: string
}

export interface TableProps<Values> extends Table_RowsCommonProps {
  contents: Values[],
  accumulator: (header: string, contents: Array<any>) => string | null | number,
  className?: string,
  onHeaderClick: (header: string, order: "ASC" | "DESC") => any,
}

export interface TableRowsProps extends Table_RowsCommonProps {
  content: any,
  index: number,
}

export interface TableHeaderProps {
  headers: string[],
  collapseContents?: string[]
  onHeaderClick: (header: string, order: "ASC" | "DESC") => any,
}

export interface TimerState {
  timeout: number,
  timer: undefined | number
}


export interface IErrorLog {
  quiz: string,
  target: string,
  message: string,
  level: "ERROR" | "WARN",
  _id: string
}

export interface IPlaySettingsOptionsState {
  shuffle_options: boolean,
  shuffle_quizzes: boolean,
  shuffle_questions: boolean,
  instant_feedback: boolean,
  flatten_mix: boolean,
  partial_score: boolean
}

export interface IPlaySettingsFiltersState {
  time_allocated: [number, number],
  excluded_difficulty: TQuestionDifficulty[],
  excluded_types: TQuestionType[],
}

export interface IQuizInputPartial {
  title: string,
  subject: string,
  questions: TQuestionInputPartial[],
  _id: string,
}

export interface IQuizInputFull extends Required<IQuizInputPartial> {
  questions: TQuestionInputFull[]
}

export interface IPlaySettings {
  options: IPlaySettingsOptionsState,
  filters: IPlaySettingsFiltersState
}

export type TQuestionType = 'MCQ' | 'MS' | 'FIB' | 'Snippet';
export type TQuestionFormat = 'text' | 'code';
export type TQuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IQuestionInputPartial{
  type?: TQuestionType,
  format?: TQuestionFormat,
  image?: string,
  weight?: number,
  time_allocated?: number,
  difficulty?: TQuestionDifficulty,
  explanation?: string,
  hints?: string[],
  language?: Language,
  _id?: string,
}
export interface IMcqQuestionInputPartial extends IQuestionInputPartial{
  question: string,
  options: string[],
  answers: string[],
  type?: "MCQ"
}

export interface IMsQuestionInputPartial extends IQuestionInputPartial{
  question: string,
  options: string[],
  answers: string[],
  type?: "MS"
}

export interface ISnippetQuestionInputPartial extends IQuestionInputPartial{
  question: string,
  options: undefined,
  answers: string[],
  type?: "Snippet"
}

export interface IFibQuestionInputPartial extends IQuestionInputPartial{
  question: string[],
  options: undefined,
  answers: string[],
  type?: "FIB"
}

export type IMcqQuestionInputFull = Required<IMcqQuestionInputPartial>
export type IMsQuestionInputFull = Required<IMsQuestionInputPartial>
export type ISnippetQuestionInputFull = Required<ISnippetQuestionInputPartial>
export type IFibQuestionInputFull = Required<IFibQuestionInputPartial>

export type TQuestionInputPartial = IFibQuestionInputPartial | ISnippetQuestionInputPartial | IMsQuestionInputPartial | IMcqQuestionInputPartial;
export type TQuestionInputFull = (IFibQuestionInputFull | ISnippetQuestionInputFull | IMsQuestionInputFull | IMcqQuestionInputFull ) & {quiz: QuizIdentifiers};

export interface HighlighterProps {
  code: string,
  language: Language,
}

export interface QuestionHighlighterProps extends HighlighterProps {
  type: TQuestionType,
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>,
  answers: QuestionAnswersType,
  image?: string
}

export interface QuizIdentifiers {
  title: string,
  _id: string,
  subject: string
}

export type AnswerModifier = "IS" | "IC"

export type IQuestionAnswerModifiers = Array<Array<string> | null>
export interface IQuestionAnswerNode {
  answers: Record<string, string>,
}

export type QuestionAnswersNodes = Array<IQuestionAnswerNode>
export type QuestionAnswersType = string[];

export interface Result {
  user_answers: string[],
  verdict: boolean,
  score: number,
  answers: QuestionAnswersType,
  question: string | string[],
  type: TQuestionType,
  time_allocated: number,
  time_taken: number,
  explanation: string,
  hints_used: number,
  difficulty: TQuestionDifficulty,
  _id: string,
  question_id: string,
  quiz: string,
  subject: string,
  quizId: string,
  weight: number
}

export interface ReportProps {
  results: Result[],
  all_questions_map: Record<string, TQuestionInputFull>,
  selected_quizzes: QuizIdentifiers[],
  setResults: (results: any[]) => any
}

export interface IReportFilterState {
  time_taken: [number, number],
  verdict: boolean | 'mixed',
  hints_used: number | 'any',
  excluded_types: TQuestionType[],
  excluded_difficulty: TQuestionDifficulty[],
  excluded_quizzes: string[],
  excluded_columns: string[]
}

export interface ReportFilterRProps {
  ReportFilterState: IReportFilterState,
  ReportFilter: JSX.Element
}

export interface ReportExportProps {
  filtered_results: Result[],
  filtered_quizzes: IQuizInputFull[]
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
export interface ISettings {
  theme: AllowedTheme,
  animation: boolean,
  sound: boolean,
  hovertips: boolean
}
export interface SettingsProps {
  settings: ISettings,
  setSettings: (settings: ISettings) => any
}

export interface MenuProps {
  initial_position?: "left" | "right",
  initial_open?: boolean,
  children: any,
  width?: number,
  lskey: string,
  content: JSX.Element
}

export interface MenuRProps {
  MenuComponent: JSX.Element,
  MenuExtra: {
    content_elem_style: any
  }
}

export interface ToggleItemsRProps {
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
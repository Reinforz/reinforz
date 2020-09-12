import { Language } from "prism-react-renderer";
import { ThemeOptions, Theme } from '@material-ui/core/styles';

// Basic Components
export interface ListProps<T> {
  items: T[],
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: string) => void)[],
  header: string,
  setItems: (data: T[]) => void,
  children: any
}

export interface ListState {
  selectedItems: string[]
}

export interface ListUtils {
  setSelectedItems: (items: string[]) => void
}

export interface ListRProps {
  ListComponent: JSX.Element,
  ListState: ListState,
  ListUtils: ListUtils
}

export interface StatsProps {
  item: any,
  stats: string[],
};

interface Table_RowsCommonProps {
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  title?: string
}

export interface TableProps<Values> extends Table_RowsCommonProps {
  contents: Values[],
  accumulator: (header: string, contents: Array<any>) => string | null | number,
  className?: string
}

export interface TableRowsProps extends Table_RowsCommonProps {
  content: any,
  index: number,
}

export interface TimerProps {
  timeout: number,
  onTimerEnd: any,
  children: any
}

export interface TimerState {
  timeout: number,
  timer: undefined | number
}

export interface TimerUtils {
  clearInterval: (shouldClearInterval: boolean) => void
}

export interface TimerRProps {
  TimerComponent: JSX.Element,
  TimerState: TimerState,
  TimerUtils: TimerUtils
}

export interface PlayErrorLogsProps {
  quizzes: QuizInputFull[]
}

export interface PlayErrorLog {
  quiz: string,
  question_name: string,
  question_number: number,
  message: string
}

export type PlayErrorLogState = PlayErrorLog[];

export interface PlaySettingsProps {
  children: any,
  selectedQuizzes: string[],
  setPlaying: (isPlaying: boolean) => any
}

export interface IPlaySettingsOptionsState {
  shuffle_options: boolean,
  shuffle_quizzes: boolean,
  shuffle_questions: boolean,
  instant_feedback: boolean,
  flatten_mix: boolean,
}

export interface IPlaySettingsFiltersState {
  time_allocated: [number, number],
  excluded_difficulty: QuestionDifficulty[],
  excluded_types: QuestionType[],
}

export interface IPlaySettingsState {
  play_options: IPlaySettingsOptionsState,
  play_filters: IPlaySettingsFiltersState,
}

export interface IPlaySettingsRProps {
  PlaySettingsComponent: JSX.Element,
  PlaySettingsState: IPlaySettingsState,
}

export interface PlayUploadProps {
  setItems: (items: any[]) => any,
  items: any[],
  setSelectedItems: (items: any[]) => void,
  selectedItems: string[]
}

export interface QuestionProps {
  question: QuestionInputFull,
  changeCounter: (user_answers: string[], time_taken: number, hints_used: number) => void,
  hasEnd: boolean,
};

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
export type QuestionFormat = 'text' | 'code';
export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

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
  difficulty?: QuestionDifficulty,
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
  language?: Language
}

export interface QuestionInputPartial extends QuestionInputCommon, Partial<QuestionInput> { }

export type QuestionInputKeys = Array<keyof QuestionInputPartial>;

export interface QuestionInputFull extends Required<QuestionInput>, QuestionInputCommon { }

export type QuestionInputsPartial = QuestionInputPartial[];
export type QuestionInputsFull = QuestionInputFull[];

export interface QuestionHighlighterProps {
  code: string,
  language: Language,
  type: QuestionType,
  format: QuestionFormat,
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>
}

export interface QuestionHintsProps {
  hints: string[],
  children: any
}

export interface IQuestionHintsState {
  hints_used: number
}

export interface QuestionHintsRProps {
  QuestionHintsComponent: JSX.Element,
  QuestionHintsState: IQuestionHintsState
}

export interface QuestionOptionsProps {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: QuestionInputFull,
}

export interface QuizProps {
  all_questions: QuestionInputFull[],
  play_options: IPlaySettingsOptionsState
}

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
  difficulty: QuestionDifficulty,
  _id: string,
  question_id: string,
}

export interface ReportProps {
  results: Result[],
  all_questions_map: Record<string, QuestionInputFull>
}

export interface ReportFilterState {
  time_taken: [number, number],
  verdict: boolean | 'mixed',
  hints_used: number | 'any',
  excluded_types: QuestionType[],
  excluded_difficulty: QuestionDifficulty[]
}

export interface ReportFilterRProps {
  report_filter_state: ReportFilterState,
  ReportFilter: JSX.Element
}

export interface ReportExportProps {
  filtered_results: Result[],
  all_questions_map: Record<string, QuestionInputFull>
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
}
export interface SettingsProps {
  settings: ISettings,
  setSettings: (settings: ISettings) => any
}
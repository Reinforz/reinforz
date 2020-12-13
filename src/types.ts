import { Language } from "prism-react-renderer";
import { ThemeOptions, Theme } from '@material-ui/core/styles';
import { IPlaySettingsOptionsState } from "./components/Play/PlaySettings/PlaySettingsOptions/types";
import { IPlaySettingsFiltersState } from "./components/Play/PlaySettings/PlaySettingsFilters/types";

// Basic Components

export type ListAction = "add" | "remove";

interface ListPropsCommon<T> {
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: string) => void)[],
  onDelete?: (items: T[]) => void
  items: T[],
}

export interface ListProps<T> extends ListPropsCommon<T> {
  header: string,
  children: any,
  setItems: (data: T[]) => void,
}

export interface ListItemProps<T> extends ListPropsCommon<T> {
  item: T,
  index: number,
  setItems: any,
  setSelectedItems: any,
  selectedItems: string[],
  onDrag: (dragIndex: number, hoverIndex: number) => void
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

export interface DragItem {
  index: number
  id: string
  type: string
}

export interface StatsProps {
  item: any,
  stats: (string | undefined)[],
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

export interface PlayErrorLogsProps {
  quizzes: QuizInputFull[],
  setQuizzes: (quizzes: any[]) => void,
  children: any
}

export interface PlayErrorLogsRProps {
  PlayErrorLogsComponent: JSX.Element
}
export interface PlayErrorLog {
  quiz: string,
  target: string,
  message: string,
  level: "ERROR" | "WARN",
  _id: string
}

export type PlayErrorLogState = PlayErrorLog[];

export interface PlaySettingsProps {
  children: any,
  selectedQuizzes: string[],
  setPlaying: (isPlaying: boolean) => any,
  quizzes: QuizInputFull[]
}
export interface IPlaySettingsState {
  play_options: IPlaySettingsOptionsState,
  play_filters: IPlaySettingsFiltersState,
}

export interface IPlaySettingsRProps {
  PlaySettingsComponent: JSX.Element,
  PlaySettingsState: IPlaySettingsState,
  PlaySettingsExtra: {
    filtered_questions: QuestionInputFull[],
    selected_quizzes: QuizIdentifiers[]
  }
}

export interface PlayUploadRProps {
  PlayUploadComponents: {
    PlayUpload: JSX.Element,
    PlayErrorLogs: JSX.Element
  },
  PlayUploadState: {
    items: any[],
  },
  PlayUploadUtils: {
    setItems: (items: any[]) => any,
    removeErrorLogs: (items: any[]) => any,
  }
}

export interface QuestionProps {
  question: QuestionInputFull,
  changeCounter: (user_answers: string[], time_taken: number, hints_used: number) => void,
  hasEnd: boolean,
  index: number,
  total: number
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

export interface HighlighterProps {
  code: string,
  language: Language,
}

export interface QuestionHighlighterProps extends HighlighterProps {
  type: QuestionType,
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>,
  answers: string[],
  image?: string
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
  QuestionHintsUtils: {
    getNextIndex: () => void
  }
}

export interface QuestionOptionsProps {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: QuestionInputFull,
}

export interface QuizIdentifiers {
  title: string,
  _id: string,
  subject: string
}
export interface QuizProps {
  all_questions: QuestionInputFull[],
  play_options: IPlaySettingsOptionsState,
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

export interface ReportProps {
  results: Result[],
  all_questions_map: Record<string, QuestionInputFull>,
  selected_quizzes: QuizIdentifiers[],
  setResults: (results: any[]) => any
}

export interface IReportFilterState {
  time_taken: [number, number],
  verdict: boolean | 'mixed',
  hints_used: number | 'any',
  excluded_types: QuestionType[],
  excluded_difficulty: QuestionDifficulty[],
  excluded_quizzes: string[],
  excluded_columns: string[]
}

export interface ReportFilterRProps {
  ReportFilterState: IReportFilterState,
  ReportFilter: JSX.Element
}

export interface ReportExportProps {
  filtered_results: Result[],
  filtered_quizzes: QuizInputFull[]
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
export interface IPlayContext {
  setPlaying: (isPlaying: boolean) => void,
  setQuizzes: (quizzes: QuizInputFull[]) => void,
  setSelected: (selected: string[]) => void
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
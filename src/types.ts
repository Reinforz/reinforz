import { Theme, ThemeOptions } from '@material-ui/core/styles';
import { Language } from 'prism-react-renderer';

// Basic Components

interface Table_RowsCommonProps {
  collapseContents?: string[];
  transformValue?: (header: string, content: any) => string;
  headers: string[];
  title?: string;
}

export interface TableProps<Values> extends Table_RowsCommonProps {
  contents: Values[];
  accumulator: (header: string, contents: Array<any>) => string | null | number;
  className?: string;
  onHeaderClick: (header: string, order: 'ASC' | 'DESC') => any;
}

export interface TableRowsProps extends Table_RowsCommonProps {
  content: any;
  index: number;
}

export interface TableHeaderProps {
  headers: string[];
  collapseContents?: string[];
  onHeaderClick: (header: string, order: 'ASC' | 'DESC') => any;
}

export interface IErrorLog {
  quiz: string;
  target: string;
  message: string;
  level: 'ERROR' | 'WARN';
  _id: string;
}

export interface IPlaySettingsOptionsState {
  shuffle_options: boolean;
  shuffle_quizzes: boolean;
  shuffle_questions: boolean;
  instant_feedback: boolean;
  flatten_mix: boolean;
  partial_score: boolean;
}

export interface IPlaySettingsFiltersState {
  time_allocated: [number, number];
  excluded_difficulty: TQuestionDifficulty[];
  excluded_types: TQuestionType[];
}

export interface IQuizPartial {
  title: string;
  subject: string;
  questions: TQuestionPartial[];
  _id?: string;
}

export interface IQuizFull{
  title: string;
  subject: string;
  questions: TQuestionFull[];
  _id: string;
}

export interface IPlaySettings {
  options: IPlaySettingsOptionsState;
  filters: IPlaySettingsFiltersState;
}

export type TQuestionType = 'MCQ' | 'MS' | 'FIB' | 'Snippet';
export type TQuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IQuestionPartial {
  type?: TQuestionType;
  image?: string;
  weight?: number;
  time_allocated?: number;
  difficulty?: TQuestionDifficulty;
  explanation?: string;
  hints?: string[];
  _id?: string;
}

export interface SelectionQuestionOptions {
  text: string;
  index: string;
}

export interface IMcqQuestionPartial extends IQuestionPartial {
  question: string;
  options: string[];
  type?: 'MCQ';
  answers: string[];
}

export interface IMsQuestionPartial extends IQuestionPartial {
  question: string;
  options: string[];
  type?: 'MS';
  answers: string[];
}

export interface ISnippetQuestionPartial extends IQuestionPartial {
  question: string;
  type?: 'Snippet';
  answers: IQuestionAnswer[];
}

export interface IFibQuestionPartial extends IQuestionPartial {
  question: string[];
  type?: 'FIB';
  answers: IQuestionAnswer[];
}

export interface IQuestionAnswer {
  text: string;
}

export interface IMcqQuestionFull extends Required<IQuestionPartial> {
  question: string;
  options: SelectionQuestionOptions[];
  type: 'MCQ';
  answers: string[];
  quiz: QuizIdentifiers;
}

export interface IMsQuestionFull extends Required<IQuestionPartial> {
  question: string;
  options: SelectionQuestionOptions[];
  type: 'MS';
  answers: string[];
  quiz: QuizIdentifiers;
}

export interface ISnippetQuestionFull extends Required<IQuestionPartial> {
  question: string;
  options: undefined;
  type: 'Snippet';
  answers: IQuestionAnswer[];
  quiz: QuizIdentifiers;
}

export interface IFibQuestionFull extends Required<IQuestionPartial> {
  question: string[];
  options: undefined;
  type: 'FIB';
  answers: IQuestionAnswer[];
  quiz: QuizIdentifiers;
}

export type TQuestionPartial =
  | IFibQuestionPartial
  | ISnippetQuestionPartial
  | IMsQuestionPartial
  | IMcqQuestionPartial;
export type TQuestionFull =
  | IFibQuestionFull
  | ISnippetQuestionFull
  | IMsQuestionFull
  | IMcqQuestionFull;
export type TInputQuestionFull = ISnippetQuestionFull | IFibQuestionFull;
export type TSelectionQuestionFull = IMcqQuestionFull | IMsQuestionFull;
export interface HighlighterProps {
  code: string;
  language: Language;
}

export interface QuestionHighlighterProps extends HighlighterProps {
  type: TQuestionType;
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>;
  answers: string[];
  image?: string;
}

export interface QuizIdentifiers {
  title: string;
  _id: string;
  subject: string;
}

export interface IResult {
  user_answers: string[];
  verdict: boolean;
  score: number;
  time_taken: number;
  hints_used: number;
  question_id: string;
}

export interface IMsQuestionResult extends IMsQuestionFull, IResult {}
export interface IMcqQuestionResult extends IMcqQuestionFull, IResult {}
export interface ISnippetQuestionResult extends ISnippetQuestionFull, IResult {}
export interface IFibQuestionResult extends IFibQuestionFull, IResult {}
export type TQuestionResult =
  | IMsQuestionResult
  | IMcqQuestionResult
  | ISnippetQuestionResult
  | IFibQuestionResult;

export interface IReportFilterState {
  time_taken: [number, number];
  verdict: boolean | 'mixed';
  hints_used: number | 'any';
  excluded_types: TQuestionType[];
  excluded_difficulty: TQuestionDifficulty[];
  excluded_quizzes: string[];
  excluded_columns: string[];
}

type color = {
  dark: string;
  base: string;
  light: string;
  opposite_dark: string;
  opposite_base: string;
  opposite_light: string;
};

export interface ExtendedThemeOptions extends ThemeOptions {
  color: color;
}

export interface ExtendedTheme extends Theme {
  color: color;
}

export type AllowedTheme = 'dark' | 'light';
export interface ISettings {
  theme: AllowedTheme;
  animation: boolean;
  sound: boolean;
  hovertips: boolean;
}
export interface SettingsProps {
  settings: ISettings;
  setSettings: (settings: ISettings) => any;
}

export interface MenuProps {
  initial_position?: 'left' | 'right';
  initial_open?: boolean;
  children: any;
  width?: number;
  lskey: string;
  content: JSX.Element;
}

export interface MenuRProps {
  MenuComponent: JSX.Element;
  MenuExtra: {
    content_elem_style: any;
  };
}

import { QuestionDifficulty, QuestionType, QuizIdentifiers } from "../../../types";

export interface ReportFilterProps {
  selected_quizzes: QuizIdentifiers[],
  children: any
}

export interface ReportFilterState {
  time_taken: [number, number],
  verdict: boolean | 'mixed',
  hints_used: number | 'any',
  excluded_types: QuestionType[],
  excluded_difficulty: QuestionDifficulty[],
  excluded_quizzes: string[],
  excluded_columns: string[]
}

export interface ReportFilterRenderProps {
  ReportFilterState: ReportFilterState,
  ReportFilter: JSX.Element
}
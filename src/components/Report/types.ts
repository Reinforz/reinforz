import { Result, QuestionInputFull, QuizIdentifiers } from "../../types";

export interface ReportProps {
  results: Result[],
  all_questions_map: Record<string, QuestionInputFull>,
  selected_quizzes: QuizIdentifiers[],
  setResults: (results: any[]) => any
}
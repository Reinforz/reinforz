import { QuizInputFull, Result } from "../../../types";

export interface ReportExportProps {
  filtered_results: Result[],
  filtered_quizzes: QuizInputFull[]
}
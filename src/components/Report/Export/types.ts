import { QuizInputFull, Result } from "../../../types";

export interface ReportExportProps {
  filtered_results: Result[],
  filtered_quizzes: QuizInputFull[]
}

export type TReportExportType = "Original" | "Report";
export type TReportExportAs = "YAML" | "JSON";
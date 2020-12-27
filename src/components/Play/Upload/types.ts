import { QuizInputFull } from "../../../types";

export interface PlayErrorLog {
  quiz: string,
  target: string,
  message: string,
  level: "ERROR" | "WARN",
  _id: string
}

export interface PlayUploadState {
  items: QuizInputFull[]
  setItems: (quizzes: QuizInputFull[]) => void
}

export type PlayErrorLogState = PlayErrorLog[];
import { QuizInputFull } from "../../../types";

export interface PlayUploadState {
  items: QuizInputFull[]
  setItems: (quizzes: QuizInputFull[]) => void
}

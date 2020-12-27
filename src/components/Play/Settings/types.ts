import { QuizInputFull } from "../../../types";

export interface PlaySettingsProps {
  children: any,
  selectedQuizzes: string[],
  setPlaying: (isPlaying: boolean) => any,
  quizzes: QuizInputFull[]
}
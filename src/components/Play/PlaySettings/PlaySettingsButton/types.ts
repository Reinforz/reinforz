import { QuestionInputFull } from "../../../../types";

export interface PlaySettingsButtonProps {
  filtered_questions: QuestionInputFull[],
  selected_quizzes: string[],
  setPlaying: (status: boolean) => void
}

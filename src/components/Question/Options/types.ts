import { QuestionInputFull } from "../../../types";

export interface QuestionOptionsProps {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: QuestionInputFull,
}
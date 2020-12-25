import { QuestionInputFull } from "../../types";

export interface QuestionProps {
  question: QuestionInputFull,
  changeCounter: (user_answers: string[], time_taken: number, hints_used: number) => void,
  hasEnd: boolean,
  index: number,
  total: number
};

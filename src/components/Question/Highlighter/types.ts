import { Language } from "prism-react-renderer";
import { QuestionType } from "../../../types";

export interface HighlighterProps {
  code: string,
  language: Language,
}

export interface QuestionHighlighterProps extends HighlighterProps {
  type: QuestionType,
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>,
  answers: string[],
  image?: string
}
export interface QuestionHintsProps {
  hints: string[],
  children: any
}

export interface IQuestionHintsState {
  hints_used: number
}

export interface QuestionHintsRenderProps {
  QuestionHintsComponent: JSX.Element,
  QuestionHintsState: IQuestionHintsState
  QuestionHintsUtils: {
    getNextIndex: () => void
  }
}
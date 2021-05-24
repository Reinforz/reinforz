import { IPlaySettings, IQuizFull, TQuestionFull } from '../types';

export function generateQuestionsMap(
  filteredQuizzes: IQuizFull[],
  playSettings: IPlaySettings
) {
  const allQuestions: TQuestionFull[] = [];
  const allQuestionsMap: Map<string, TQuestionFull> = new Map();

  filteredQuizzes.forEach((filteredQuiz) => {
    filteredQuiz.questions = filteredQuiz.questions.filter(
      (question) =>
        !playSettings.filters.excluded_difficulty.includes(
          question.difficulty
        ) &&
        !playSettings.filters.excluded_types.includes(question.type) &&
        playSettings.filters.time_allocated[0] <= question.time_allocated &&
        playSettings.filters.time_allocated[1] >= question.time_allocated
    );
    allQuestions.push(...filteredQuiz.questions);
    filteredQuiz.questions.forEach((question) =>
      allQuestionsMap.set(question._id, question)
    );
  });
  return [allQuestions, allQuestionsMap] as const;
}

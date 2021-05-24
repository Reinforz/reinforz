import {
  IQuizFull,
  IReportFilterState,
  TQuestionFull,
  TQuestionResult
} from '../types';

export function applyReportFilters(
  results: TQuestionResult[],
  reportFilter: IReportFilterState,
  allQuestionsMap: Map<string, TQuestionFull>
) {
  const {
    excluded_types,
    excluded_quizzes,
    excluded_difficulty,
    verdict,
    hints_used,
    time_taken
  } = reportFilter;
  const filteredResults = results.filter(
    (result) =>
      !excluded_types.includes(result.type) &&
      !excluded_difficulty.includes(result.difficulty) &&
      (verdict === 'mixed' ||
        verdict.toString() === result.verdict?.toString()) &&
      (hints_used === 'any' || result.hints_used <= hints_used) &&
      time_taken[0] <= result.time_taken &&
      time_taken[1] >= result.time_taken &&
      !excluded_quizzes.includes(result.quiz._id)
  );
  const filteredQuizzes: Record<string, IQuizFull> = {};
  filteredResults.forEach((filteredResult) => {
    const targetQuestion = allQuestionsMap.get(filteredResult.question_id)!;
    const clonedTargetQuestion = JSON.parse(
      JSON.stringify(targetQuestion)
    ) as TQuestionFull;
    if (!filteredQuizzes[targetQuestion.quiz._id])
      filteredQuizzes[targetQuestion.quiz._id] = {
        ...targetQuestion.quiz,
        questions: [clonedTargetQuestion]
      };
    else
      filteredQuizzes[targetQuestion.quiz._id].questions.push(
        clonedTargetQuestion
      );
  });

  return [filteredResults, filteredQuizzes] as const;
}

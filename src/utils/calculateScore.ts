interface Parameter {
  weight: number;
  time_taken: number;
  hints_used: number;
  partial_score: boolean;
  verdict: boolean;
  totalHints: number;
  time_allocated: number;
  totalAnswers: number;
  totalCorrectAnswers: number;
}

export function calculateScore(parameter: Parameter) {
  const {
    weight,
    time_taken,
    hints_used,
    partial_score,
    verdict,
    totalHints,
    time_allocated,
    totalAnswers,
    totalCorrectAnswers
  } = parameter;
  const correct_answers_score = 0.5 * (totalCorrectAnswers / totalAnswers);
  const hints_score = verdict
    ? (0.2 / totalHints) * (totalHints - hints_used)
    : 0;
  const totalTimeDivisions = Math.ceil(time_allocated / 15),
    timeDivisions = Math.floor(time_taken / 15);
  const time_taken_score = verdict
    ? (0.3 / totalTimeDivisions) * (totalTimeDivisions - timeDivisions)
    : 0;
  return (
    weight *
    (partial_score
      ? Number(
          (correct_answers_score + hints_score + time_taken_score).toFixed(2)
        )
      : verdict
      ? 1
      : 0)
  );
}

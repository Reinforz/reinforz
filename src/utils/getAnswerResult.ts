import shortid from 'shortid';
import { TQuestionFull } from '../types';
import { calculateScore } from './calculateScore';

export default function getAnswerResult(
  current_question: TQuestionFull,
  user_answers: string[],
  time_taken: number,
  hints_used: number,
  partial_score: boolean
) {
  let totalCorrectAnswers = 0;
  const { hints, weight, time_allocated, answers } = current_question;
  user_answers = user_answers.filter((user_answer) => user_answer !== '');
  let verdict = false;

  switch (current_question.type) {
    case 'MCQ':
      verdict =
        current_question.answers.length === user_answers.length &&
        answers[0].toString() ===
          current_question.options![parseInt(user_answers[0])].index;
      totalCorrectAnswers = verdict ? 1 : 0;
      break;
    case 'MS':
      verdict =
        user_answers.length === answers.length &&
        user_answers.every((user_answer) => {
          const isCorrect = current_question.answers.includes(
            current_question.options![parseInt(user_answer)].index
          );
          if (isCorrect) totalCorrectAnswers++;
          return isCorrect;
        });
      break;
    case 'Snippet':
    case 'FIB':
      verdict = user_answers.length === answers.length;
      current_question.answers.forEach((answer, i) => {
        if (user_answers[i] === answer.text) totalCorrectAnswers++;
      });
      verdict = totalCorrectAnswers === answers.length;
      break;
  }

  return {
    verdict,
    score: calculateScore({
      weight,
      time_allocated,
      time_taken,
      hints_used,
      partial_score,
      verdict,
      totalAnswers: answers.length,
      totalCorrectAnswers,
      totalHints: hints.length
    }),
    _id: shortid()
  };
}

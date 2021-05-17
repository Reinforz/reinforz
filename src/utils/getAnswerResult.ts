import shortid from "shortid";
import { TQuestionInputFull } from "../types";
import { checkTextAnswer } from "./";

export default function getAnswerResult (current_question: Pick<TQuestionInputFull, "weight" | "type" | "time_allocated" | "answers" | "options">, user_answers: string[], time_taken: number, hints_used: number, partial_score: boolean){
  let totalCorrectAnswers = 0;
  const { weight, time_allocated, answers } = current_question;
  user_answers = user_answers.filter(user_answer => user_answer !== "");
  let verdict = false;

  switch (current_question.type) {
    case "MCQ":
      verdict = answers.length === user_answers.length && answers[0].toString() === current_question.options![Number(user_answers[0])].index;
      totalCorrectAnswers = verdict ? 1 : 0
      break;
    case "MS":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer) => {
        const isCorrect = (answers as string[]).includes(current_question.options![Number(user_answer)].index);
        if (isCorrect) totalCorrectAnswers++
        return isCorrect
      });
      break;
    case "Snippet":
    case "FIB":
      verdict = user_answers.length === answers.length;
      totalCorrectAnswers = checkTextAnswer(user_answers, answers);
      verdict = totalCorrectAnswers === answers.length;
      break;
  }

  const correct_answers_score = 0.5 * (totalCorrectAnswers / answers.length)
  const hints_score = (correct_answers_score / 0.5) * (0.2 - (hints_used * 0.067));
  const time_taken_score = (correct_answers_score / 0.5) * 0.3 * (1 / Math.ceil((time_taken + 1) / (time_allocated / 4)));

  return {
    verdict,
    score: weight * (partial_score ? Number((correct_answers_score + hints_score + time_taken_score).toFixed(2)) : (verdict ? 1 : 0)),
    _id: shortid(),
  }
}
import md5 from "md5";
import shortid from "shortid";
import { TQuestionInputFull } from "../types";
import { checkTextAnswer } from "./";

export default function getAnswerResult (current_question: TQuestionInputFull, user_answers: string[], time_taken: number, hints_used: number, options_md5_map: Record<string, number>, partial_score: boolean){
  let total_correct_answers = 0;
  const { quiz: { title, _id: quizId, subject }, difficulty, _id, weight, type, question, format, time_allocated, answers, explanation } = current_question;
  user_answers = user_answers.filter(user_answer => user_answer !== "");
  let verdict = false;
  if (type.match(/(MCQ|MS)/) && current_question.options && user_answers.length !== 0)
    user_answers = user_answers.map(user_answer => options_md5_map[md5((current_question.options as any)[parseInt(user_answer)])].toString());
  switch (type) {
    case "MCQ":
      verdict = answers.length === user_answers.length && answers[0].toString() === user_answers[0].toString();
      total_correct_answers = verdict ? 1 : 0
      break;
    case "MS":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer) => {
        const isCorrect = (answers as string[]).includes(user_answer);
        if (isCorrect) total_correct_answers++
        return isCorrect
      });
      break;
    case "Snippet":
    case "FIB":
      verdict = user_answers.length === answers.length;
      total_correct_answers = checkTextAnswer(user_answers, answers);
      verdict = total_correct_answers === answers.length;
      break;
  }

  const correct_answers_score = 0.5 * (total_correct_answers / answers.length)
  const hints_score = (correct_answers_score / 0.5) * (0.2 - (hints_used * 0.067));
  const time_taken_score = (correct_answers_score / 0.5) * 0.3 * (1 / Math.ceil((time_taken + 1) / (time_allocated / 4)));

  return {
    user_answers,
    answers,
    verdict,
    score: weight * (partial_score ? Number((correct_answers_score + hints_score + time_taken_score).toFixed(2)) : (verdict ? 1 : 0)),
    question: format !== "code" ? question : "<Code/>",
    type,
    time_allocated,
    time_taken,
    explanation,
    hints_used,
    difficulty,
    question_id: _id,
    _id: shortid(),
    quiz: title, subject,
    quizId,
    weight
  }
}
import { QuestionType } from "../types";

export default function (type: QuestionType, answers: (string | number)[], user_answers: (string | number)[]) {
  let verdict: boolean = false;
  switch (type) {
    case "MCQ":
    case "Snippet":
      verdict = answers.length === user_answers.length && answers[0].toString() === user_answers[0].toString();
      break;
    case "MS":
      user_answers = user_answers.map(user_answer => parseInt(user_answer as string)).sort();
      answers = answers.map(answer => parseInt(answer as string)).sort();
      verdict = user_answers.length === answers.length && user_answers.every((user_answer, i) => user_answer === answers[i]);
      break;
    case "FIB":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer, i) => user_answer === answers[i]);
      break;
  }
  return verdict;
}
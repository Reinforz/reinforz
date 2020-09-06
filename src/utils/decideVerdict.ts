import { QuestionType } from "../types";

export default function (type: QuestionType, answers: string[], user_answers: string[]) {
  let verdict: boolean = false;
  switch (type) {
    case "MCQ":
      verdict = answers.length === user_answers.length && answers[0].toString() === user_answers[0].toString();
      break;
    case "Snippet":
      verdict = answers.length === user_answers.length && answers[0].split(",").includes(user_answers[0].toString());
      break;
    case "MS":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer) => answers.includes(user_answer));
      break;
    case "FIB":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer, i) => answers[i].split(",").includes(user_answer));
      break;
  }
  return verdict;
}
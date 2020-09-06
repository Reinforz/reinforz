import { QuestionType } from "../types";

const expandOptions = (option: string): string[] => {
  const options: string[] = [];
  option.split(",").forEach(option => {
    const modifiers = option.match(/^_(\w{2}\s?)*_/);
    if (modifiers) {
      option = option.replace(modifiers[0], '');
      const mods = modifiers[0].replace(/_/g, '').split(" ");
      if (mods.includes("IC")) options.push(option.charAt(0).toUpperCase() + option.substr(1), option.toUpperCase());
      if (mods.includes("IS")) options.push(option.replace(/\s/g, ''));
    }
    options.push(option);
  })
  return options;
}

export default function (type: QuestionType, answers: string[], user_answers: string[]) {
  let verdict: boolean = false;
  switch (type) {
    case "MCQ":
      verdict = answers.length === user_answers.length && answers[0].toString() === user_answers[0].toString();
      break;
    case "MS":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer) => answers.includes(user_answer));
      break;
    case "Snippet":
    case "FIB":
      verdict = user_answers.length === answers.length && user_answers.every((user_answer, i) => expandOptions(answers[i]).includes(user_answer));
      break;
  }
  return verdict;
}
import clone from "just-clone";
import shortid from "shortid"

import { QuestionInputPartial, QuestionInputFull } from '../types';

function setObjectValues(
  parent: any,
  arr: (string | [string, any | undefined])[]
) {
  arr.forEach(entry => {
    if (Array.isArray(entry)) {
      if (typeof parent[entry[0]] === 'undefined') parent[entry[0]] = entry[1];
    } else if (typeof parent[entry] === 'undefined') parent[entry] = undefined;
  });
}

export function generateQuestionInputConfigs(
  question: QuestionInputPartial,
) {
  const res = clone(question);

  if (res.options) {
    res.options = res.options.map(option => {
      switch (option) {
        case "T":
          return "True";
        case "t":
          return "true";
        case "F":
          return "False";
        case "f":
          return "false";
        case "Y":
          return "Yes";
        case "y":
          return "yes";
        case "N":
          return "No";
        case "n":
          return "no";
        default:
          return option;
      }
    })
  }

  if (!Array.isArray(res.answers)) {
    res.answers = [res.answers.toString()] as string[];
    question.answers = [(question.answers).toString()];
  }

  res.answers = res.answers.map(answer => answer.toString());
  question.answers = (question.answers as string[]).map(answer => answer.toString());
  if (res.options && question.options) {
    res.options = res.options.map(option => option.toString())
    question.options = question.options.map(option => option.toString())
  }

  let format = 'text', time_allocated = 15, language = undefined;

  const lines = res.question.split("\n");

  language = lines[0].match(/\[(\w+)\]/);
  if (language) {
    res.question = lines.splice(1).join("\n")
    format = 'code';
    language = language[1]
  }
  else language = "javascript"

  setObjectValues(res, [
    ['options', null],
    ['format', format],
    ['image', null],
    ['weight', 1],
    ['difficulty', 'Beginner'],
    ['explanation', 'No explanation available'],
    ['hints', []],
    ['language', language]
  ]);

  // Auto generation of Question Configs
  if (res.answers.length === 1) res.type = res.type || (res.options ? "MCQ" : "Snippet");
  else res.type = res.type || (res.options ? "MS" : "FIB");

  res.answers = res.answers.map((answer: string) => answer.toString());

  switch (res.type) {
    case "MCQ":
      time_allocated = 15;
      break;
    case "MS":
      if (question.answers.length > (question as any).options.length) {
        (question as any).answers.length = question.answers.length;
      }

      time_allocated = 30;
      break;
    case "Snippet":
      time_allocated = 45;
      break;
    case "FIB":
      time_allocated = 60;
      break;
  }

  if (!res.time_allocated)
    res.time_allocated = time_allocated;
  res._id = shortid();

  return res as QuestionInputFull;
}

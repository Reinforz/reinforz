import { QuestionInputPartial, QuestionInputFull } from '../types';
import convertToAnswerAST from './convertToAnswerAST';

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

function checkRequiredFields(check: Record<string, any>, fields: string[]) {
  fields.forEach(field => {
    if (check[field] === undefined) throw new Error(`${field} is required`);
  })
}

export function generateQuestionInputConfigs(
  question: QuestionInputPartial,
) {
  const res = JSON.parse(JSON.stringify(question));
  checkRequiredFields(res, ['question', 'answers']);
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

  if (res.answers.length === 1) res.type = res.options ? "MCQ" : "Snippet";
  else res.type = res.options ? "MS" : "FIB";

  res.answers = res.type.match(/(Snippet|FIB)/) ? convertToAnswerAST(res.answers) : res.answers.map((answer: string) => answer.toString());

  switch (res.type) {
    case "MCQ":
      time_allocated = 15;
      break;
    case "MS":
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

  return res as QuestionInputFull;
}

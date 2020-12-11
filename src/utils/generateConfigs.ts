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
  const logs: { warns: string[], errors: string[] } = { warns: [], errors: [] };

  const res = clone(question);

  ['question', 'answers'].forEach(field => {
    if ((res as any)[field] === undefined) logs.errors.push(`Question ${field} is required`);
  })

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
  if (logs.errors.length === 0) {
    if (res.answers.length === 1) res.type = res.type || (res.options ? "MCQ" : "Snippet");
    else res.type = res.type || (res.options ? "MS" : "FIB");

    res.answers = res.answers.map((answer: string) => answer.toString());
    switch (res.type) {
      case "MCQ":
        time_allocated = 15;
        if (!question.options) logs.errors.push(`Options must be provided for ${res.type} questions`)
        if (parseInt(question.answers[0]) > (question as any).options.length - 1 || parseInt(question.answers[0]) < 0) logs.errors.push(`MCQ Answer must be within 0-${(question as any).options.length - 1}, provided ${res.answers[0]}`);
        break;
      case "MS":
        if (question.answers.length > (question as any).options.length) {
          logs.warns.push(`Provided more answers than options, truncating to ${(question as any).options.length}`);
          (question as any).answers.length = question.answers.length;
        }
        question.answers.forEach(answer => {
          if (parseInt(answer) < 0 || parseInt(answer) > (question as any).options.length - 1) logs.errors.push(`MS Answer must be within 0-${(question as any).options.length - 1}, provided ${res.answers[0]}`)
        })
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

    if (res.format !== question.format && question.format !== undefined) logs.warns.push(`Question is of format ${res.format} but given ${question.format}`);
    if (res.time_allocated < 10) {
      logs.warns.push(`Question time allocated must be >=10 but given ${res.time_allocated}, changing to 10`);
      res.time_allocated = 10;
    } else if (res.time_allocated > 60) {
      logs.warns.push(`Question time allocated must be <=60 but given ${res.time_allocated}, changing to 60`);
      res.time_allocated = 60;
    }
    if ((res as any).hints.length > 3) {
      logs.warns.push(`Question hints can be 3 at most, but given ${(res as any).hints.length}, changing to 3`);
      (res as any).hints.length = 3;
    }
    if (res.type.match(/(MS|MCQ)/) && (res as any).options.length < 2)
      logs.errors.push(`Question must have at least 2 options, but given ${(res as any).options.length}`);
    else if (res.type.match(/(MS|MCQ)/) && (res as any).options.length > 6) {
      logs.errors.push(`Question must have at most 6 options, but given ${(res as any).options.length}, changing to 6`);
      (res as any).options.length = 3;
    }

    if ((res as any).weight < 0) {
      logs.warns.push(`Question weights must be >=0 but given ${res.weight}, changing to 0`);
      res.weight = 0;
    } else if ((res as any).weight > 1) {
      logs.warns.push(`Question weight must be <=1 but given ${res.weight}, changing to 1`);
      res.weight = 1;
    }

    if (!["Beginner", "Intermediate", "Advanced"].includes((res as any).difficulty)) {
      logs.warns.push(`Question difficulty must be one of Beginner,Intermediate or  Advanced ${res.difficulty}, changing to Beginner`);
      (res as any).difficulty = "Beginner";
    }
  }

  return [res, logs] as [QuestionInputFull, { warns: string[], errors: string[] }];
}

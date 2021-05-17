import clone from "just-clone";
import shortid from "shortid";
import { TQuestionInputFull, TQuestionInputPartial } from '../types';


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

export default function generateQuestionInputConfigs(
  question: TQuestionInputPartial,
) {
  const logs: { warns: string[], errors: string[] } = { warns: [], errors: [] };

  const questionFull: TQuestionInputFull = clone(question) as any;

  ['question', 'answers'].forEach(field => {
    if ((questionFull as any)[field] === undefined) logs.errors.push(`Question ${field} is required`);
  })

  questionFull.answers = questionFull.answers.map(answer => answer.toString());
  question.answers = question.answers.map(answer => answer.toString());
  if (questionFull.options && question.options) {
    questionFull.options = questionFull.options.map((option, i) => ({
      text: option.toString(),
      index: `${i}`
    }))
    question.options = question.options.map(option => option.toString())
  }

  let format = 'text', time_allocated = 15, language = undefined;

  const lines = Array.isArray(questionFull.question) ? questionFull.question : questionFull.question.split("\n");

  language = lines[0].match(/\[(\w+)\]/);
  if (language) {
    questionFull.question = lines.splice(1).join("\n")
    format = 'code';
    language = language[1]
  }
  else language = "javascript"

  setObjectValues(questionFull, [
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
    if (questionFull.answers.length === 1) questionFull.type = questionFull.type || ((questionFull as any).options ? "MCQ" : "Snippet");
    else questionFull.type = questionFull.type || ((questionFull as any).options ? "MS" : "FIB");

    questionFull.answers = questionFull.answers.map((answer: string) => answer.toString());
    switch (questionFull.type) {
      case "MCQ":
        time_allocated = 15;
        if (!question.options) logs.errors.push(`Options must be provided for ${questionFull.type} questions`)
        if (parseInt(question.answers[0]) > (question as any).options.length - 1 || parseInt(question.answers[0]) < 0) logs.errors.push(`MCQ Answer must be within 0-${(question as any).options.length - 1}, provided ${questionFull.answers[0]}`);
        break;
      case "MS":
        if (question.answers.length > (question as any).options.length) {
          logs.warns.push(`Provided more answers than options, truncating to ${(question as any).options.length}`);
          (question as any).answers.length = question.answers.length;
        }
        question.answers.forEach(answer => {
          if (parseInt(answer) < 0 || parseInt(answer) > (question as any).options.length - 1) logs.errors.push(`MS Answer must be within 0-${(question as any).options.length - 1}, provided ${questionFull.answers[0]}`)
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
    if (!questionFull.time_allocated)
      questionFull.time_allocated = time_allocated;
    questionFull._id = shortid();

    if (questionFull.format !== question.format && question.format !== undefined) logs.warns.push(`Question is of format ${questionFull.format} but given ${question.format}`);
    if (questionFull.time_allocated < 10) {
      logs.warns.push(`Question time allocated must be >=10 but given ${questionFull.time_allocated}, changing to 10`);
      questionFull.time_allocated = 10;
    } else if (questionFull.time_allocated > 60) {
      logs.warns.push(`Question time allocated must be <=60 but given ${questionFull.time_allocated}, changing to 60`);
      questionFull.time_allocated = 60;
    }
    if ((questionFull as any).hints.length > 3) {
      logs.warns.push(`Question hints can be 3 at most, but given ${(questionFull as any).hints.length}, changing to 3`);
      (questionFull as any).hints.length = 3;
    }
    if (questionFull.type.match(/(MS|MCQ)/) && (questionFull as any).options.length < 2)
      logs.errors.push(`Question must have at least 2 options, but given ${(questionFull as any).options.length}`);
    else if (questionFull.type.match(/(MS|MCQ)/) && (questionFull as any).options.length > 6) {
      logs.errors.push(`Question must have at most 6 options, but given ${(questionFull as any).options.length}, changing to 6`);
      (questionFull as any).options.length = 3;
    }

    if ((questionFull as any).weight < 0) {
      logs.warns.push(`Question weights must be >=0 but given ${questionFull.weight}, changing to 0`);
      questionFull.weight = 0;
    } else if ((questionFull as any).weight > 1) {
      logs.warns.push(`Question weight must be <=1 but given ${questionFull.weight}, changing to 1`);
      questionFull.weight = 1;
    }

    if (!["Beginner", "Intermediate", "Advanced"].includes((questionFull as any).difficulty)) {
      logs.warns.push(`Question difficulty must be one of Beginner,Intermediate or  Advanced ${questionFull.difficulty}, changing to Beginner`);
      (questionFull as any).difficulty = "Beginner";
    }
  }
  return [questionFull, logs] as const;
}

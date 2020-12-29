import { QuestionInputFull } from "../types";

export function detectErrors(question: QuestionInputFull) {
  const logs: { warns: string[], errors: string[] } = { warns: [], errors: [] };

  (['question', 'answers'] as const).forEach(field => {
    if (question[field] === undefined) logs.errors.push(`Question ${field} is required`);
  })

  if (question.time_allocated < 10) {
    logs.warns.push(`Question time allocated must be >=10 but given ${question.time_allocated}, changing to 10`);
    question.time_allocated = 10;
  } else if (question.time_allocated > 60) {
    logs.warns.push(`Question time allocated must be <=60 but given ${question.time_allocated}, changing to 60`);
    question.time_allocated = 60;
  }
  if (question.hints.length > 3) {
    logs.warns.push(`Question hints can be 3 at most, but given ${question.hints.length}, changing to 3`);
    question.hints.length = 3;
  }

  if (question.type === "MS" || question.type === "MCQ") {
    if (question.type === "MS") {
      if (!question.options) logs.errors.push(`Options must be provided for ${question.type} questions`)
      question.answers.forEach(answer => {
        if (parseInt(answer) < 0 || parseInt(answer) > (question as any).options.length - 1) logs.errors.push(`MS Answer must be within 0-${(question as any).options.length - 1}, provided ${res.answers[0]}`)
      })
    }
    else if (question.type === "MCQ") {
      if (question.answers.length > question.options.length)
        logs.warns.push(`Provided more answers than options, truncating to ${(question as any).options.length}`);
      if (parseInt(question.answers[0]) > (question as any).options.length - 1 || parseInt(question.answers[0]) < 0) logs.errors.push(`MCQ Answer must be within 0-${(question as any).options.length - 1}, provided ${res.answers[0]}`);
    }
    if (question.options.length < 2)
      logs.errors.push(`Question must have at least 2 options, but given ${question.options.length}`);
    else if (question.options.length > 6)
      logs.errors.push(`Question must have at most 6 options, but given ${question.options.length}, changing to 6`);
  }

  if (question.weight < 0) {
    logs.warns.push(`Question weights must be >=0 but given ${question.weight}, changing to 0`);
    question.weight = 0;
  } else if (question.weight > 1) {
    logs.warns.push(`Question weight must be <=1 but given ${question.weight}, changing to 1`);
    question.weight = 1;
  }

  if (!["Beginner", "Intermediate", "Advanced"].includes(question.difficulty)) {
    logs.warns.push(`Question difficulty must be one of Beginner,Intermediate or  Advanced ${question.difficulty}, changing to Beginner`);
    question.difficulty = "Beginner";
  }

  if (res.format !== question.format && question.format !== undefined) logs.warns.push(`Question is of format ${res.format} but given ${question.format}`);

  return logs;
}
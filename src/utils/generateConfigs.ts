import shortid from 'shortid';
import { TQuestionFull, TQuestionPartial } from '../types';

function setObjectValues(parent: any, arr: [string, any][]) {
  arr.forEach((entry) => {
    parent[entry[0]] = parent[entry[0]] ?? entry[1];
  });
}

export default function generateQuestionInputConfigs(
  question: TQuestionPartial
) {
  const logs: { warns: string[]; errors: string[] } = { warns: [], errors: [] };

  const completeQuestion: TQuestionFull = JSON.parse(JSON.stringify(question));

  (['question', 'answers'] as const).forEach((field) => {
    completeQuestion[field] ??
      logs.errors.push(`Question ${field} is required`);
  });

  question.answers = question.answers.map((answer) => answer.toString());

  if (completeQuestion.options && question.options) {
    completeQuestion.options = completeQuestion.options.map((option, i) => ({
      text: option.toString(),
      index: `${i}`
    }));
    question.options = question.options.map((option) => option.toString());
  }

  let format = 'text',
    time_allocated = 15,
    language = undefined;

  const lines = Array.isArray(completeQuestion.question)
    ? completeQuestion.question
    : completeQuestion.question.split('\n');

  language = lines[0].match(/\[(\w+)\]/);
  if (language) {
    completeQuestion.question = lines.splice(1).join('\n');
    format = 'code';
    language = language[1];
  } else language = 'javascript';

  setObjectValues(completeQuestion, [
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
    if (completeQuestion.answers.length === 1)
      completeQuestion.type =
        completeQuestion.type ||
        ((completeQuestion as any).options ? 'MCQ' : 'Snippet');
    else
      completeQuestion.type =
        completeQuestion.type ||
        ((completeQuestion as any).options ? 'MS' : 'FIB');

    switch (completeQuestion.type) {
      case 'MCQ':
        completeQuestion.answers = completeQuestion.answers.map(
          (answer: string) => answer.toString()
        );
        time_allocated = 15;
        if (!question.options)
          logs.errors.push(
            `Options must be provided for ${completeQuestion.type} questions`
          );
        if (
          parseInt(question.answers[0]) >
            (question as any).options.length - 1 ||
          parseInt(question.answers[0]) < 0
        )
          logs.errors.push(
            `MCQ Answer must be within 0-${
              (question as any).options.length - 1
            }, provided ${completeQuestion.answers[0]}`
          );
        break;
      case 'MS':
        completeQuestion.answers = completeQuestion.answers.map(
          (answer: string) => answer.toString()
        );
        if (question.answers.length > (question as any).options.length) {
          logs.warns.push(
            `Provided more answers than options, truncating to ${
              (question as any).options.length
            }`
          );
          (question as any).answers.length = question.answers.length;
        }
        question.answers.forEach((answer) => {
          if (
            parseInt(answer) < 0 ||
            parseInt(answer) > (question as any).options.length - 1
          )
            logs.errors.push(
              `MS Answer must be within 0-${
                (question as any).options.length - 1
              }, provided ${completeQuestion.answers[0]}`
            );
        });
        time_allocated = 30;
        break;
      case 'Snippet':
        completeQuestion.answers = completeQuestion.answers.map((answer) => ({
          ...answer,
          text: answer.text.toString()
        }));
        time_allocated = 45;
        break;
      case 'FIB':
        completeQuestion.answers = completeQuestion.answers.map((answer) => ({
          ...answer,
          text: answer.text.toString()
        }));
        time_allocated = 60;
        break;
    }
    if (!completeQuestion.time_allocated)
      completeQuestion.time_allocated = time_allocated;
    completeQuestion._id = shortid();

    if (
      completeQuestion.format !== question.format &&
      question.format !== undefined
    )
      logs.warns.push(
        `Question is of format ${completeQuestion.format} but given ${question.format}`
      );
    if (completeQuestion.time_allocated < 10) {
      logs.warns.push(
        `Question time allocated must be >=10 but given ${completeQuestion.time_allocated}, changing to 10`
      );
      completeQuestion.time_allocated = 10;
    } else if (completeQuestion.time_allocated > 60) {
      logs.warns.push(
        `Question time allocated must be <=60 but given ${completeQuestion.time_allocated}, changing to 60`
      );
      completeQuestion.time_allocated = 60;
    }
    if ((completeQuestion as any).hints.length > 3) {
      logs.warns.push(
        `Question hints can be 3 at most, but given ${
          (completeQuestion as any).hints.length
        }, changing to 3`
      );
      (completeQuestion as any).hints.length = 3;
    }
    if (
      completeQuestion.type.match(/(MS|MCQ)/) &&
      (completeQuestion as any).options.length < 2
    )
      logs.errors.push(
        `Question must have at least 2 options, but given ${
          (completeQuestion as any).options.length
        }`
      );
    else if (
      completeQuestion.type.match(/(MS|MCQ)/) &&
      (completeQuestion as any).options.length > 6
    ) {
      logs.errors.push(
        `Question must have at most 6 options, but given ${
          (completeQuestion as any).options.length
        }, changing to 6`
      );
      (completeQuestion as any).options.length = 3;
    }

    if ((completeQuestion as any).weight < 0) {
      logs.warns.push(
        `Question weights must be >=0 but given ${completeQuestion.weight}, changing to 0`
      );
      completeQuestion.weight = 0;
    } else if ((completeQuestion as any).weight > 1) {
      logs.warns.push(
        `Question weight must be <=1 but given ${completeQuestion.weight}, changing to 1`
      );
      completeQuestion.weight = 1;
    }

    if (
      !['Beginner', 'Intermediate', 'Advanced'].includes(
        (completeQuestion as any).difficulty
      )
    ) {
      logs.warns.push(
        `Question difficulty must be one of Beginner,Intermediate or  Advanced ${completeQuestion.difficulty}, changing to Beginner`
      );
      (completeQuestion as any).difficulty = 'Beginner';
    }
  }
  return [completeQuestion, logs] as const;
}

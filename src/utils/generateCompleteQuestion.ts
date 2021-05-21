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

  if (completeQuestion.options) {
    completeQuestion.options = completeQuestion.options.map((option, i) => ({
      text: option.toString(),
      index: `${i}`
    }));
  }

  let format = 'text',
    time_allocated = 15;

  setObjectValues(completeQuestion, [
    ['options', null],
    ['format', format],
    ['image', null],
    ['weight', 1],
    ['difficulty', 'Beginner'],
    ['explanation', 'No explanation available'],
    ['hints', []],
    ['language', completeQuestion.language]
  ]);

  const dummyQuestion: any = completeQuestion;

  // Auto generation of Question Configs
  if (logs.errors.length === 0) {
    // Auto infer question type
    if (completeQuestion.answers.length === 1)
      completeQuestion.type =
        completeQuestion.type || (dummyQuestion.options ? 'MCQ' : 'Snippet');
    else
      completeQuestion.type =
        completeQuestion.type || (dummyQuestion.options ? 'MS' : 'FIB');

    switch (completeQuestion.type) {
      case 'MCQ':
        // Convert all the answers to string
        completeQuestion.answers = completeQuestion.answers.map((answer) =>
          answer.toString()
        );
        time_allocated = 15;
        // If there are no options for MCQ question, add an error
        if (!dummyQuestion.options)
          logs.errors.push(
            `Options must be provided for ${dummyQuestion.type} questions`
          );
        // If the answer index is greater than total options, or negative add an error
        if (
          parseInt(dummyQuestion.answers[0]) >
            dummyQuestion.options.length - 1 ||
          parseInt(dummyQuestion.answers[0]) < 0
        )
          logs.errors.push(
            `MCQ Answer must be within 0-${
              dummyQuestion.options.length - 1
            }, provided ${dummyQuestion.answers[0]}`
          );
        break;
      case 'MS':
        completeQuestion.answers = completeQuestion.answers.map((answer) =>
          answer.toString()
        );
        // If more answers are given than options
        if (dummyQuestion.answers.length > dummyQuestion.options.length) {
          logs.errors.push(
            `Provided more answers than options, given ${dummyQuestion.options.length} options, while giving ${dummyQuestion.answers.length} answers`
          );
        }
        completeQuestion.answers.forEach((answer) => {
          if (
            parseInt(answer) < 0 ||
            parseInt(answer) > dummyQuestion.options.length - 1
          )
            logs.errors.push(
              `MS Answer must be within 0-${
                dummyQuestion.options.length - 1
              }, provided ${answer}`
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
    completeQuestion.time_allocated =
      completeQuestion.time_allocated ?? time_allocated;
    completeQuestion._id = shortid();

    if (completeQuestion.time_allocated < 10) {
      logs.warns.push(
        `Question time allocated must be >=10 but given ${completeQuestion.time_allocated}, changing to 10`
      );
      completeQuestion.time_allocated = 10;
    } else if (completeQuestion.time_allocated > 120) {
      logs.warns.push(
        `Question time allocated must be <=120 but given ${completeQuestion.time_allocated}, changing to 120`
      );
      completeQuestion.time_allocated = 120;
    }

    if (
      completeQuestion.type.match(/(MS|MCQ)/) &&
      (dummyQuestion.options.length < 2 || dummyQuestion.options.length > 6)
    )
      logs.errors.push(
        `Question must have 2-6 options, but given ${dummyQuestion.options.length}`
      );

    if (dummyQuestion.weight < 0 || dummyQuestion.weight > 1) {
      logs.warns.push(
        `Question weights must be within 0-1 but given ${completeQuestion.weight}, changing to 0`
      );
      completeQuestion.weight = 0;
    }

    if (
      !['Beginner', 'Intermediate', 'Advanced'].includes(
        completeQuestion.difficulty
      )
    ) {
      logs.warns.push(
        `Question difficulty must be one of Beginner, Intermediate or Advanced, but given ${completeQuestion.difficulty}, changing to Beginner`
      );
      completeQuestion.difficulty = 'Beginner';
    }
  }
  return [completeQuestion, logs] as const;
}

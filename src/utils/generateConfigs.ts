import { QuestionInputPartial } from '../types';

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
  checkRequiredFields(question, ['question', 'answers', 'options']);

  setObjectValues(question, [
    ['type', 'MCQ'],
    ['format', 'text'],
    'image',
    ['weight', 1],
    ['add_to_score', true],
    ['time_allocated', 30],
    ['difficulty', 'Beginner'],
    ['correct_answer_message', 'Congrats on the correct answer'],
    ['incorrect_answer_message', 'Try again'],
    'explanation',
  ]);

  return question;
}

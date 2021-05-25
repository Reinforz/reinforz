import { TQuestionResult } from '../../src/types';
import { applyResultFilters } from '../../src/utils';

const result: TQuestionResult = {
  type: 'FIB',
  difficulty: 'Advanced',
  verdict: true,
  hints_used: 0,
  time_taken: 20,
  quiz: {
    subject: 'Subject 1',
    title: 'Title 1',
    _id: '1'
  },
  question_id: '1',
  _id: '1',
  answers: [],
  explanation: null,
  hints: [],
  image: null,
  question: ['Question 1'],
  score: 1,
  time_allocated: 30,
  user_answers: [],
  weight: 1,
  options: undefined
};

it(`Should filter out if question type is within excluded_types`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: [],
    excluded_quizzes: [],
    excluded_types: ['FIB'],
    hints_used: 0,
    time_taken: [0, 60],
    verdict: true
  });

  expect(filteredResults).toStrictEqual([]);
});

it(`Should filter out if question difficulty is within excluded_difficulty`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: ['Advanced'],
    excluded_quizzes: [],
    excluded_types: [],
    hints_used: 0,
    time_taken: [0, 60],
    verdict: true
  });

  expect(filteredResults).toStrictEqual([]);
});

it(`Should filter out if question verdict is different from filter verdict`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: [],
    excluded_quizzes: [],
    excluded_types: [],
    hints_used: 0,
    time_taken: [0, 60],
    verdict: false
  });

  expect(filteredResults).toStrictEqual([]);
});

it(`Should filter out if question time taken is less than lower bound of time_taken`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: [],
    excluded_quizzes: [],
    excluded_types: [],
    hints_used: 0,
    time_taken: [30, 60],
    verdict: true
  });

  expect(filteredResults).toStrictEqual([]);
});

it(`Should filter out if question time taken is greater than upper bound of time_taken`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: [],
    excluded_quizzes: [],
    excluded_types: [],
    hints_used: 0,
    time_taken: [10, 15],
    verdict: true
  });

  expect(filteredResults).toStrictEqual([]);
});

it(`Should filter out if quiz id is within excluded_quizzes`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: [],
    excluded_quizzes: ['1'],
    excluded_types: [],
    hints_used: 0,
    time_taken: [0, 60],
    verdict: true
  });

  expect(filteredResults).toStrictEqual([]);
});

it(`Should return result if no filter catches it`, () => {
  const filteredResults = applyResultFilters([result], {
    excluded_difficulty: [],
    excluded_quizzes: [],
    excluded_types: [],
    hints_used: 0,
    time_taken: [0, 60],
    verdict: true
  });

  expect(filteredResults).toStrictEqual([result]);
});
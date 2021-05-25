import { applyReportFilters } from '../../src/utils';

it(`Should work`, () => {
  const [filteredResults, filteredQuizzes] = applyReportFilters(
    [
      {
        type: 'FIB',
        difficulty: 'Advanced',
        verdict: true,
        hints_used: 0,
        time_taken: 20,
        quiz: {
          _id: '1'
        },
        question_id: '1'
      }
    ],
    {
      excluded_difficulty: ['Advanced'],
      excluded_quizzes: ['1'],
      excluded_types: ['FIB'],
      hints_used: 0,
      time_taken: [10, 25],
      verdict: 'mixed'
    },
    new Map()
  );
});

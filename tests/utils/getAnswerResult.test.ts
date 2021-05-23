import { getAnswerResult } from '../../src/utils';

describe('MCQ Questions', () => {
  it(`Should work for correct answers`, () => {
    const info = getAnswerResult(
      {
        type: 'MCQ',
        answers: ['0'],
        options: [
          {
            text: 'Option 2',
            index: '1'
          },
          {
            text: 'Option 1',
            index: '0'
          },
          {
            text: 'Option 3',
            index: '2'
          }
        ],
        time_allocated: 30,
        weight: 1,
        hints: ['Hint 1', 'Hint 2', 'Hint 3']
      } as any,
      ['1'],
      14,
      0,
      true
    );
    expect(info).toStrictEqual({
      verdict: true,
      score: 1,
      _id: expect.any(String)
    });
  });

  it(`Should work for wrong answers`, () => {
    const info = getAnswerResult(
      {
        type: 'MCQ',
        answers: ['0'],
        options: [
          {
            text: 'Option 3',
            index: '2'
          },
          {
            text: 'Option 1',
            index: '0'
          },
          {
            text: 'Option 2',
            index: '1'
          }
        ],
        time_allocated: 30,
        weight: 1,
        hints: ['Hint 1', 'Hint 2', 'Hint 3']
      } as any,
      ['2'],
      14,
      0,
      false
    );
    expect(info).toStrictEqual({
      verdict: false,
      score: 0,
      _id: expect.any(String)
    });
  });
});

describe('MS Questions', () => {
  it(`Should work for correct answers`, () => {
    const info = getAnswerResult(
      {
        type: 'MS',
        answers: ['0', '1'],
        options: [
          {
            text: 'Option 3',
            index: '2'
          },
          {
            text: 'Option 1',
            index: '0'
          },
          {
            text: 'Option 2',
            index: '1'
          }
        ],
        time_allocated: 30,
        weight: 1,
        hints: ['Hint 1', 'Hint 2', 'Hint 3']
      } as any,
      ['1', '2'],
      14,
      0,
      true
    );
    expect(info).toStrictEqual({
      verdict: true,
      score: 1,
      _id: expect.any(String)
    });
  });

  it(`Should work for correct answers`, () => {
    const info = getAnswerResult(
      {
        type: 'MS',
        answers: ['0', '1'],
        options: [
          {
            text: 'Option 3',
            index: '2'
          },
          {
            text: 'Option 1',
            index: '0'
          },
          {
            text: 'Option 2',
            index: '1'
          }
        ],
        time_allocated: 30,
        weight: 1,
        hints: ['Hint 1', 'Hint 2', 'Hint 3']
      } as any,
      ['0', '2'],
      14,
      0,
      false
    );
    expect(info).toStrictEqual({
      verdict: false,
      score: 0,
      _id: expect.any(String)
    });
  });
});

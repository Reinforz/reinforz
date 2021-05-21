import { generateCompleteQuestion } from '../../src/utils';

describe('MCQ type questions', () => {
  it(`Should generate default configs`, () => {
    const [completeQuestion, logs] = generateCompleteQuestion({
      answers: ['1'],
      type: 'MCQ',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      question: 'Question'
    });
    expect(completeQuestion).toStrictEqual({
      answers: ['1'],
      type: 'MCQ',
      options: [
        { text: 'Option 1', index: '0' },
        { text: 'Option 2', index: '1' },
        { text: 'Option 3', index: '2' },
        { text: 'Option 4', index: '3' }
      ],
      question: 'Question',
      format: 'text',
      image: null,
      weight: 1,
      difficulty: 'Beginner',
      explanation: 'No explanation available',
      hints: [],
      language: undefined,
      time_allocated: 15,
      _id: expect.any(String)
    });
    expect(logs).toStrictEqual({ warns: [], errors: [] });
  });
});

describe('MS type questions', () => {
  it(`Should generate default configs`, () => {
    const [completeQuestion, logs] = generateCompleteQuestion({
      answers: ['1', '2'],
      type: 'MS',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      question: 'Question'
    });
    expect(completeQuestion).toStrictEqual({
      answers: ['1', '2'],
      type: 'MS',
      options: [
        { text: 'Option 1', index: '0' },
        { text: 'Option 2', index: '1' },
        { text: 'Option 3', index: '2' },
        { text: 'Option 4', index: '3' }
      ],
      question: 'Question',
      format: 'text',
      image: null,
      weight: 1,
      difficulty: 'Beginner',
      explanation: 'No explanation available',
      hints: [],
      language: undefined,
      time_allocated: 30,
      _id: expect.any(String)
    });
    expect(logs).toStrictEqual({ warns: [], errors: [] });
  });
});

describe('Snippet type questions', () => {
  it(`Should generate default configs`, () => {
    const [completeQuestion, logs] = generateCompleteQuestion({
      answers: [
        {
          text: '1'
        }
      ],
      type: 'Snippet',
      question: 'Question'
    });
    expect(completeQuestion).toStrictEqual({
      answers: [
        {
          text: '1'
        }
      ],
      type: 'Snippet',
      question: 'Question',
      format: 'text',
      image: null,
      weight: 1,
      difficulty: 'Beginner',
      explanation: 'No explanation available',
      hints: [],
      language: undefined,
      time_allocated: 45,
      _id: expect.any(String)
    });
    expect(logs).toStrictEqual({ warns: [], errors: [] });
  });
});

describe('FIB type questions', () => {
  it(`Should generate default configs`, () => {
    const [completeQuestion, logs] = generateCompleteQuestion({
      answers: [
        {
          text: '1'
        }
      ],
      type: 'FIB',
      question: ['Question']
    });
    expect(completeQuestion).toStrictEqual({
      answers: [
        {
          text: '1'
        }
      ],
      type: 'FIB',
      question: ['Question'],
      format: 'text',
      image: null,
      weight: 1,
      difficulty: 'Beginner',
      explanation: 'No explanation available',
      hints: [],
      language: undefined,
      time_allocated: 60,
      _id: expect.any(String)
    });
    expect(logs).toStrictEqual({ warns: [], errors: [] });
  });
});

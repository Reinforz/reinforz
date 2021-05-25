import { checkInputAnswer, modifyAnswers } from '../../src/utils';

describe('modifyAnswers', () => {
  it(`Should modify all answers`, () => {
    const [modifiedUserAnswer, modifiedAnswerText] = modifyAnswers(
      'Hello world',
      {
        modifiers: ['IC', 'IS'],
        text: 'Hello WORLD'
      }
    );
    expect(modifiedUserAnswer).toStrictEqual('helloworld');
    expect(modifiedAnswerText).toStrictEqual('helloworld');
  });
});

describe('checkInputAnswer', () => {
  describe('Answer text', () => {
    it(`Should match regular answer text`, () => {
      const isCorrect = checkInputAnswer('Hello World', [
        {
          modifiers: [],
          regex: null,
          text: 'helloworld'
        },
        {
          modifiers: ['IC', 'IS'],
          regex: null,
          text: 'Hello World'
        }
      ]);
      expect(isCorrect).toStrictEqual(true);
    });

    it(`Should not match regular answer text`, () => {
      const isCorrect = checkInputAnswer('Hello World', [
        {
          modifiers: [],
          regex: null,
          text: 'helloworld'
        },
        {
          modifiers: [],
          regex: null,
          text: 'hello world'
        }
      ]);
      expect(isCorrect).toStrictEqual(false);
    });
  });

  describe('Answer regex', () => {
    it(`Should match regular answer regex`, () => {
      const isCorrect = checkInputAnswer('Hello World', [
        {
          modifiers: [],
          regex: {
            regex: 'Hello World',
            flags: ''
          },
          text: 'helloworld'
        }
      ]);
      expect(isCorrect).toStrictEqual(true);
    });

    it(`Should not match regular answer regex`, () => {
      const isCorrect = checkInputAnswer('Hello World', [
        {
          modifiers: [],
          regex: {
            regex: 'HelloWorld',
            flags: ''
          },
          text: 'helloworld'
        }
      ]);
      expect(isCorrect).toStrictEqual(false);
    });
  });
});

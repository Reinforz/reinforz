import { IQuestionAnswerFull } from '../../src/types';
import { modifyAnswers } from '../../src/utils';

describe('modifyAnswers', () => {
  it(`Should modify all answers`, () => {
    const answer: IQuestionAnswerFull = {
      alts: [
        {
          text: 'Hello World',
          regexes: null
        }
      ],
      modifiers: ['IC', 'IS'],
      regexes: null,
      text: 'Hello WORLD'
    };

    const userAnswer = modifyAnswers('Hello world', answer);
    expect(userAnswer).toStrictEqual('helloworld');
    expect(answer).toStrictEqual({
      alts: [
        {
          text: 'helloworld'
        }
      ]
    });
  });
});

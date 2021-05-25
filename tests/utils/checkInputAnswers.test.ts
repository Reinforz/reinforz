import { modifyAnswers } from '../../src/utils';

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

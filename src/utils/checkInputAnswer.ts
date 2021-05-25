import { IQuestionAnswerFull } from '../types';

/**
 * Checks user's answer against an answer object and returns whether or not it matches the given answer
 * @param userAnswer User answer to check against
 * @param answer An answer object containing actual modified text and regexes to match user's answer against
 * @returns whether user's answer matches the answer
 */
export function checkUserAnswerAgainstGivenAnswer(
  userAnswer: string,
  answer: Omit<IQuestionAnswerFull, 'alts' | 'modifiers'>
) {
  let isCorrect = userAnswer === answer.text;
  if (!isCorrect) {
    for (let index = 0; index < answer.regexes.length; index++) {
      const regex = new RegExp(
        answer.regexes[index].regex,
        answer.regexes[index].flags
      );
      isCorrect = Boolean(userAnswer.match(regex));
      if (isCorrect) break;
    }
  }
  return isCorrect;
}

/**
 * Checks user's answer against an answer object and returns whether or not it matches the given answers including its alternates
 * @param userAnswer user's answer to check against
 * @param answer An answer object containing actual modified answer text, regexes and alternates
 * @returns whether user's answer matches any of the answers
 */
export function checkUserAnswerAgainstAllGivenAnswers(
  userAnswer: string,
  answer: IQuestionAnswerFull
) {
  let isCorrect = checkUserAnswerAgainstGivenAnswer(userAnswer, answer);

  if (!isCorrect) {
    for (let index = 0; index < answer.alts.length; index++) {
      isCorrect = checkUserAnswerAgainstGivenAnswer(
        userAnswer,
        answer.alts[index]
      );
      if (isCorrect) break;
    }
  }

  return isCorrect;
}

/**
 * Modifies the user's answers and all the text/alternate texts of the answer by applying the modifiers
 * @param userAnswer user's answer to check against
 * @param answer answer info object
 */
export function modifyAnswers(userAnswer: string, answer: IQuestionAnswerFull) {
  answer.modifiers.forEach((modifier) => {
    switch (modifier) {
      case 'IC': {
        userAnswer = userAnswer.toLowerCase();
        answer.text = answer.text.toLowerCase();
        answer.alts.forEach((alt) => {
          alt.text = alt.text.toLowerCase();
        });
        break;
      }
      case 'IS': {
        userAnswer = userAnswer.replace(/\s/g, '');
        answer.text = answer.text.replace(/\s/g, '');
        answer.alts.forEach((alt) => {
          alt.text = alt.text.replace(/\s/g, '');
        });
        break;
      }
    }
  });
  return userAnswer;
}

/**
 * Checks user's answer against all the answers
 * @param userAnswers user's answer to check against
 * @param answers answer info object
 * @returns Whether or not user's answer is correct
 */
export function checkInputAnswer(
  userAnswers: string[],
  answers: IQuestionAnswerFull[]
) {
  let isCorrect = false;
  for (let index = 0; index < userAnswers.length; index++) {
    const userAnswer = modifyAnswers(userAnswers[index], answers[index]);
    isCorrect = checkUserAnswerAgainstAllGivenAnswers(
      userAnswer,
      answers[index]
    );
    if (!isCorrect) break;
  }
  return isCorrect;
}

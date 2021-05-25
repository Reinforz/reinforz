import { IQuestionAnswerFull } from '../types';

/**
 * Checks user's answer against an answer object and returns whether or not it matches the given answers including its alternates
 * @param userAnswer user's answer to check against
 * @param answer An answer object containing actual modified answer text, regexes and alternates
 * @returns whether user's answer matches any of the answers
 */
export function checkUserAnswer(
  userAnswer: string,
  answers: IQuestionAnswerFull[]
) {
  let isCorrect = false;

  for (let index = 0; index < answers.length; index++) {
    const modifiedUserAnswer = modifyAnswers(userAnswer, answers[index]);
    if (modifiedUserAnswer === answers[index].text) {
      isCorrect = true;
      break;
    } else {
      const regex = answers[index].regex;
      if (regex) {
        const generatedRegex = new RegExp(regex.regex, regex.flags);
        isCorrect = Boolean(userAnswer.match(generatedRegex));
        if (isCorrect) break;
      }
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
        break;
      }
      case 'IS': {
        userAnswer = userAnswer.replace(/\s/g, '');
        answer.text = answer.text.replace(/\s/g, '');
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
  answers: IQuestionAnswerFull[][]
) {
  let isCorrect = false;
  for (let index = 0; index < userAnswers.length; index++) {
    isCorrect = checkUserAnswer(userAnswers[index], answers[index]);
    if (!isCorrect) break;
  }
  return isCorrect;
}

import { IQuestionAnswerFull } from '../types';

function checkAnswer(
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

function matchAnswer(userAnswer: string, answer: IQuestionAnswerFull) {
  let isCorrect = checkAnswer(userAnswer, answer);

  if (!isCorrect) {
    for (let index = 0; index < answer.alts.length; index++) {
      const alt = answer.alts[index];
      isCorrect = checkAnswer(userAnswer, alt);
      if (isCorrect) break;
    }
  }

  return isCorrect;
}

export function modifyAnswers(
  user_answer: string,
  answer: IQuestionAnswerFull
) {
  answer.modifiers.forEach((modifier) => {
    switch (modifier) {
      case 'IC': {
        user_answer = user_answer.toLowerCase();
        answer.text = answer.text.toLowerCase();
        answer.alts.forEach((alt) => {
          alt.text = alt.text.toLowerCase();
        });
        break;
      }
      case 'IS': {
        user_answer = user_answer.replace(/\s/g, '');
        answer.text = answer.text.replace(/\s/g, '');
        answer.alts.forEach((alt) => {
          alt.text = alt.text.replace(/\s/g, '');
        });
        break;
      }
    }
  });
}

export default function checkTextAnswer(
  userAnswers: string[],
  answers: IQuestionAnswerFull[]
) {
  let isCorrect = false;
  for (let index = 0; index < userAnswers.length; index++) {
    const userAnswer = userAnswers[index];
    modifyAnswers(userAnswer, answers[index]);
    isCorrect = matchAnswer(userAnswer, answers[index]);
    if (!isCorrect) break;
  }
  return isCorrect;
}

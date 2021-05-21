import shortid from 'shortid';
import { generateConfigs } from '.';
import { IErrorLog, IQuizFull, IQuizPartial } from '../types';

export default function filterUploadedQuizzes(quizzes: IQuizPartial[]) {
  const logMessages: IErrorLog[] = [];
  const filteredUploadedQuizzes: IQuizFull[] = [];
  quizzes.forEach((quiz, index) => {
    if (quiz.title && quiz.subject && quiz.questions.length > 0) {
      quiz._id = shortid();
      quiz.questions = quiz.questions
        .map((question, _index) => {
          const [generatedQuestion, logs] = generateConfigs(question);
          if (logs.errors.length === 0) {
            generatedQuestion.quiz = {
              subject: quiz.subject,
              title: quiz.title,
              _id: quiz._id
            };
          }
          logs.warns.forEach((warn) => {
            logMessages.push({
              _id: shortid(),
              level: 'WARN',
              quiz: `${quiz.subject} - ${quiz.title}`,
              target: `Question ${_index + 1}`,
              message: warn
            });
          });
          logs.errors.forEach((error) => {
            logMessages.push({
              _id: shortid(),
              level: 'ERROR',
              quiz: `${quiz.subject} - ${quiz.title}`,
              target: `Question ${_index + 1}`,
              message: error
            });
          });
          return logs.errors.length !== 0
            ? undefined
            : (generatedQuestion as any);
        })
        .filter((question) => question);
      filteredUploadedQuizzes.push(quiz as any);
    } else {
      if (!quiz.title)
        logMessages.push({
          _id: shortid(),
          level: 'ERROR',
          quiz: `${quiz.subject} - ${quiz.title}`,
          target: `Quiz ${index + 1}`,
          message: 'Quiz title absent'
        });
      if (!quiz.subject)
        logMessages.push({
          _id: shortid(),
          level: 'ERROR',
          quiz: `${quiz.subject} - ${quiz.title}`,
          target: `Quiz ${index + 1}`,
          message: 'Quiz subject absent'
        });
      if (quiz.questions.length <= 0)
        logMessages.push({
          _id: shortid(),
          level: 'ERROR',
          quiz: `${quiz.subject} - ${quiz.title}`,
          target: `Quiz ${index + 1}`,
          message: 'Quiz must have atleast 1 question'
        });
    }
  });

  return [logMessages, filteredUploadedQuizzes] as const;
}

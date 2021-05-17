import shortid from "shortid";
import { generateConfigs } from '.';
import { IErrorLog, IQuizInputFull, IQuizInputPartial, TQuestionInputFull } from '../types';

export default function filterUploadedQuizzes(quizzes: IQuizInputPartial[]){
  const logMessages: IErrorLog[] = [];
  const filteredUploadedQuizzes = quizzes.filter((quiz, index) => {
    if (quiz.title && quiz.subject && quiz.questions.length > 0) {
      quiz._id = shortid();
      const generatedQuestions: TQuestionInputFull[] = [];
      quiz.questions.forEach((question, _index) => {
        const [generatedQuestion, logs] = generateConfigs(question);
        if (logs.errors.length === 0) {
          generatedQuestion.quiz = { subject: quiz.subject, title: quiz.title, _id: quiz._id };
          generatedQuestions.push(generatedQuestion);
        }
        logs.warns.forEach(warn => {
          logMessages.push({ _id: shortid(), level: "WARN", quiz: `${quiz.subject} - ${quiz.title}`, target: `Question ${_index + 1}`, message: warn })
        })
        logs.errors.forEach(error => {
          logMessages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Question ${_index + 1}`, message: error })
        })
      });
      quiz.questions = generatedQuestions as any;
      return true
    } else {
      if (!quiz.title)
        logMessages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Quiz ${index + 1}`, message: "Quiz title absent" });
      if (!quiz.subject)
        logMessages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Quiz ${index + 1}`, message: "Quiz subject absent" });
      if (quiz.questions.length <= 0)
        logMessages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Quiz ${index + 1}`, message: "Quiz must have atleast 1 question" });
      return false
    }
  }) as IQuizInputFull[];

  return [logMessages , filteredUploadedQuizzes] as const;
}
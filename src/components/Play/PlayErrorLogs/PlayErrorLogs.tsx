import React, { useState, useEffect } from 'react';
import * as yup from "yup";

import { QuizInputFull } from '../../../types';

import "./PlayErrorLogs.scss";

const common_schema = {
  question: yup.string().required(),
  type: yup.string().required().oneOf(["MS", "MCQ", "FIB", "Snippet"], "Unknown question type provided"),
  answers: yup.array().of(yup.string()).min(1),
  format: yup.string().required().oneOf(["html", "markdown", "text"], "Unknown question format provided"),
  image: yup.string().nullable(),
  weight: yup.number().required().min(0).max(1),
  add_to_score: yup.boolean().required(),
  time_allocated: yup.number().required().min(10).max(60),
  difficulty: yup.string().required().oneOf(["Beginner", "Intermediate", "Advanced"], "Unknown question difficulty provided"),
  correct_answer_message: yup.string(),
  incorrect_answer_message: yup.string(),
  explanation: yup.string(),
  hints: yup.array().of(yup.string()).min(0).max(3),
  title: yup.string().required(),
  subject: yup.string().required(),
}
const OptionedQuestionSchema = yup.object({
  options: yup.array().of(yup.string()).required().min(2),
  ...common_schema
});

const OptionLessQuestionSchema = yup.object({
  ...common_schema
})

interface ErrorLogProps {
  quizzes: QuizInputFull[]
}

interface ErrorLog {
  quiz: string,
  question_name: string,
  question_number: number,
  message: string
}

export default React.memo((props: ErrorLogProps) => {
  const { quizzes } = props;
  const [error_logs, setErrorLogs] = useState([] as ErrorLog[]);
  useEffect(() => {
    const error_promises: Promise<ErrorLog>[] = [];
    quizzes.forEach(quiz => {
      quiz.questions.forEach((question, index) => {
        error_promises.push(new Promise((resolve,) => {
          if (question.type.match(/(MS|MCQ)/))
            OptionedQuestionSchema.validate(question).then(() => resolve(undefined)).catch(err => resolve({
              quiz: question.quiz,
              question_name: question.question,
              question_number: index,
              message: err.message
            })
            )
          else OptionLessQuestionSchema.validate(question).then(() => resolve(undefined)).catch(err =>
            resolve({
              quiz: question.quiz,
              question_name: question.question,
              question_number: index,
              message: err.message
            })
          )
        }))
      })
    });
    if (error_promises.length !== 0)
      Promise.all(error_promises).then((errors: ErrorLog[]) => {
        setErrorLogs(errors.filter(error => error))
      })
  }, [quizzes]);

  return (
    <div className="PlayErrorLogs">
      {error_logs.map((error_log, index) => <div key={error_log.message + index}>Error Found at {error_log.quiz}:{error_log.question_name}:{error_log.question_number} {error_log.message}</div>)}
    </div>
  );
}
)
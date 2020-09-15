import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import { useTheme } from '@material-ui/core/styles';

import { PlayErrorLogsProps, PlayErrorLog, PlayErrorLogState, ExtendedTheme } from '../../../types';

import "./PlayErrorLogs.scss";

const common_schema = {
  question: yup.string().required(),
  type: yup.string().required().oneOf(["MS", "MCQ", "FIB", "Snippet"], "Unknown question type provided"),
  answers: yup.array().of(yup.string()).min(1),
  format: yup.string().required().oneOf(["code", "text"], "Unknown question format provided"),
  image: yup.string().nullable(),
  weight: yup.number().required().min(0).max(1),
  time_allocated: yup.number().required().min(10).max(60),
  difficulty: yup.string().required().oneOf(["Beginner", "Intermediate", "Advanced"], "Unknown question difficulty provided"),
  explanation: yup.string(),
  hints: yup.array().of(yup.string()).min(0).max(3),
  _id: yup.string().required(),
  quiz: yup.object({
    title: yup.string().required(),
    subject: yup.string().required(),
    _id: yup.string().required(),
  })
}

const OptionedQuestionSchema = yup.object({
  options: yup.array().of(yup.string()).required().min(2).max(6),
  ...common_schema
});

const OptionLessQuestionSchema = yup.object({
  ...common_schema
})

export default React.memo((props: PlayErrorLogsProps) => {
  const theme = useTheme() as ExtendedTheme;

  const { quizzes } = props;
  const [error_logs, setErrorLogs] = useState([] as PlayErrorLogState);
  useEffect(() => {
    const error_promises: Promise<PlayErrorLog>[] = [];
    quizzes.forEach(quiz => {
      quiz.questions.forEach((question, index) => {
        error_promises.push(new Promise((resolve,) => {
          if (question.type.match(/(MS|MCQ)/))
            OptionedQuestionSchema.validate(question).then(() => resolve(undefined)).catch(err => resolve({
              quiz: question.quiz.title,
              question_name: question.question,
              question_number: index,
              message: err.message
            })
            )
          else OptionLessQuestionSchema.validate(question).then(() => resolve(undefined)).catch(err =>
            resolve({
              quiz: question.quiz.title,
              question_name: question.question,
              question_number: index,
              message: err.message
            })
          )
        }))
      })
    });
    if (error_promises.length !== 0)
      Promise.all(error_promises).then((errors: PlayErrorLog[]) => {
        setErrorLogs(errors.filter(error => error))
      })
  }, [quizzes]);

  return (
    <div className="PlayErrorLogs" style={{ backgroundColor: theme.color.base, color: theme.palette.text.secondary }}>
      <div className="PlayErrorLogs-header" style={{ backgroundColor: theme.color.dark }}>Errors {"&"} Warnings</div>
      <div className="PlayErrorLogs-content" style={{ backgroundColor: theme.color.dark }}>
        {error_logs.length !== 0 ? error_logs.map((error_log, index) => <div className="PlayErrorLogs-item" key={error_log.message + index}>Error Found at {error_log.quiz}:{error_log.question_name}:{error_log.question_number} {error_log.message}</div>) : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
      </div>
    </div>
  );
}
)
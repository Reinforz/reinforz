import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import { useTheme } from '@material-ui/core/styles';
import shortid from "shortid"

import { PlayErrorLogsProps, PlayErrorLog, PlayErrorLogState, ExtendedTheme, QuestionInputFull } from '../../../types';

import "./PlayErrorLogs.scss";
import { generateQuestionInputConfigs } from '../../../utils/generateConfigs';

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

const OptionLessQuestionSchema = yup.object(common_schema)

export default React.memo((props: PlayErrorLogsProps) => {
  const theme = useTheme() as ExtendedTheme;

  const { quizzes, setQuizzes, setSelectedItems } = props;

  const [error_logs, setErrorLogs] = useState([] as PlayErrorLogState);
  useEffect(() => {
    const error_promises: Promise<PlayErrorLog>[] = [];
    quizzes.forEach(quiz => {
      quiz._id = shortid();
      quiz.questions = quiz.questions.filter((question, index) => {
        console.log(question)
        try {
          const generatedquestion = { ...generateQuestionInputConfigs(question), _id: shortid(), quiz: { subject: quiz.subject, title: quiz.title, _id: quiz._id } } as QuestionInputFull;
          if (generatedquestion.type.match(/(MS|MCQ)/)) OptionedQuestionSchema.validateSync(generatedquestion);
          else OptionLessQuestionSchema.validateSync(generatedquestion);
          quiz.questions[index] = generatedquestion
          return true;
        }
        catch (err) {
          error_promises.push(new Promise((resolve) => resolve({
            level: "ERROR",
            quiz: `${quiz.subject} - ${quiz.title}`,
            question_number: index + 1,
            message: err.message
          })))
          return false;
        }
      })
    });
    Promise.all(error_promises).then((errors: PlayErrorLog[]) => {
      setErrorLogs(errors.filter(error => error))
      setQuizzes(quizzes);
      setSelectedItems(quizzes.map(quiz => quiz._id))
    })

  }, [quizzes, setQuizzes, setSelectedItems]);

  return (
    <div className="PlayErrorLogs" style={{ backgroundColor: theme.color.base, color: theme.palette.text.secondary }}>
      <div className="PlayErrorLogs-header" style={{ backgroundColor: theme.color.dark }}>Errors {"&"} Warnings</div>
      <div className="PlayErrorLogs-content" style={{ backgroundColor: theme.color.dark }}>
        {error_logs.length !== 0 ? error_logs.map((error_log, index) => <div style={{ backgroundColor: error_log.level === "ERROR" ? theme.palette.error.main : theme.palette.warning.main, color: theme.palette.text.primary }} className="PlayErrorLogs-content-item" key={error_log.message + index}>{error_log.quiz}: Question {error_log.question_number} {error_log.message}</div>) : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
      </div>
    </div>
  );
}
)
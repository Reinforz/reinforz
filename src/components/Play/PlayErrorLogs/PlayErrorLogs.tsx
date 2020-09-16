import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '@material-ui/core/styles';
import shortid from "shortid"
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { PlayErrorLogsProps, PlayErrorLog, PlayErrorLogState, ExtendedTheme, QuestionInputFull, ISettings } from '../../../types';

import { generateQuestionInputConfigs } from '../../../utils/generateConfigs';

import SettingsContext from '../../../context/SettingsContext';

import "./PlayErrorLogs.scss";

export default React.memo((props: PlayErrorLogsProps) => {
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;
  const { quizzes, setQuizzes, setSelectedItems } = props;

  const [error_logs, setErrorLogs] = useState([] as PlayErrorLogState);
  useEffect(() => {
    const log_messages: PlayErrorLog[] = [];
    quizzes.forEach(quiz => {
      quiz._id = shortid();
      const generated_questions: QuestionInputFull[] = [];
      quiz.questions.forEach((question, index) => {
        const [generatedquestion, logs] = generateQuestionInputConfigs(question);
        if (logs.errors.length === 0) {
          generatedquestion.quiz = { subject: quiz.subject, title: quiz.title, _id: quiz._id };
          generated_questions.push(generatedquestion);
        }
        logs.warns.forEach(warn => {
          log_messages.push({ _id: shortid(), level: "WARN", quiz: `${quiz.subject} - ${quiz.title}`, question_number: index + 1, message: warn })
        })
        logs.errors.forEach(error => {
          log_messages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, question_number: index + 1, message: error })
        })
      });
      quiz.questions = generated_questions;
    });

    setErrorLogs(log_messages)
    setQuizzes(quizzes);
    setSelectedItems(quizzes.map(quiz => quiz._id));
  }, [quizzes, setQuizzes, setSelectedItems]);

  return (
    <div className="PlayErrorLogs" style={{ backgroundColor: theme.color.base, color: theme.palette.text.secondary }}>
      <div className="PlayErrorLogs-header" style={{ backgroundColor: theme.color.dark }}>Errors {"&"} Warnings</div>
      <div className="PlayErrorLogs-content" style={{ backgroundColor: theme.color.dark }}>
        {error_logs.length > 0 ? <TransitionGroup component={null}>
          {error_logs.map((error_log, index) => (
            <CSSTransition
              key={error_log._id + index}
              timeout={{
                enter: (index + 1) * 250,
                exit: (index + 1) * 250
              }}
              classNames={settings.animation ? "fade" : undefined}
              appear
              style={{ backgroundColor: error_log.level === "ERROR" ? theme.palette.error.main : theme.palette.warning.main, color: theme.palette.text.primary }}
            >
              <div className="PlayErrorLogs-content-item">{error_log.quiz}: Question {error_log.question_number} {error_log.message}</div></CSSTransition>
          ))}
        </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
      </div>
    </div>
  );
}
)
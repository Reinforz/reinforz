import React, { useContext } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import shortid from "shortid";
import { PlayUploadContext } from "../";
import { useThemeSettings } from "../../../hooks";
import { IPlayErrorlog, IQuizInputFull } from "../../../types";
import { detectErrors } from "../../../utils/detectErrors";
import "./style.scss";

export interface PlayErrorlogsContextValue {
  correct_quizzes: IQuizInputFull[];
}

export const PlayErrorlogsContext = React.createContext<PlayErrorlogsContextValue>({} as any)
PlayErrorlogsContext.displayName = "PlayErrorLogsContext"

export const PlayErrorlogs = () => {
  const { theme, settings } = useThemeSettings(), playUploadContext = useContext(PlayUploadContext);
  const quizzes = playUploadContext.items as IQuizInputFull[];

  const error_logs: IPlayErrorlog[] = [];

  const correct_quizzes = quizzes.filter((quiz, index) => {
    quiz.questions = quiz.questions.filter((question, index) => {
      const { warns, errors } = detectErrors(question);
      warns.forEach(message => error_logs.push({ _id: shortid(), level: "WARN", quiz: quiz.title, target: `Question ${index + 1}`, message }))
      errors.forEach(message => error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Question ${index + 1}`, message }))
      return (warns.length === 0 && errors.length === 0);
    })

    if (!quiz.title) {
      error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Quiz ${index + 1}`, message: "Quiz title absent" });
      return false;
    }
    if (!quiz.subject) {
      error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Quiz ${index + 1}`, message: "Quiz subject absent" });
      return false;
    }
    if (quiz.questions.length <= 0) {
      error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Quiz ${index + 1}`, message: "Quiz must have at least 1 question" });
      return false;
    }
    return true;
  });

  return <PlayErrorlogsContext.Provider value={{ correct_quizzes }}>
    <div className="Play-Errorlogs" style={{ backgroundColor: theme.color.base, color: theme.palette.text.secondary }}>
      <div className="Play-Errorlogs-header" style={{ backgroundColor: theme.color.dark }}>Errors {"&"} Warnings</div>
      <div className="Play-Errorlogs-content" style={{ backgroundColor: theme.color.dark }}>
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
              <div className="Play-Errorlogs-content-item">{error_log.quiz}: {error_log.target}, {error_log.message}</div></CSSTransition>
          ))}
        </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
      </div>
    </div>
    {/* <PlayList /> */}
  </PlayErrorlogsContext.Provider>
}
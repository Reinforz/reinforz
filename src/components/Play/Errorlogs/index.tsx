import React, { useContext } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useThemeSettings } from "../../../hooks";
import { PlayErrorlog, PlayErrorlogsContext, PlayUploadContext } from "../"
import shortid from "shortid"

import "./style.scss";
import { detectErrors } from "../../../utils/detectErrors";

export const PlayErrorlogs = () => {
  const { theme, settings } = useThemeSettings(), { items: quizzes } = useContext(PlayUploadContext);

  const error_logs: PlayErrorlog[] = []
  quizzes.forEach((quiz, index) => {
    quiz.questions.forEach((question, index) => {
      const { warns, errors } = detectErrors(question);
      warns.forEach(message => error_logs.push({ _id: shortid(), level: "WARN", quiz: quiz.title, target: `Question ${index + 1}`, message }))
      errors.forEach(message => error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Question ${index + 1}`, message }))
    })

    if (!quiz.title)
      error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Quiz ${index + 1}`, message: "Quiz title absent" });
    if (!quiz.subject)
      error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Quiz ${index + 1}`, message: "Quiz subject absent" });
    if (quiz.questions.length <= 0)
      error_logs.push({ _id: shortid(), level: "ERROR", quiz: quiz.title, target: `Quiz ${index + 1}`, message: "Quiz must have atleast 1 question" });
  });

  return <PlayErrorlogsContext.Provider value={{ error_logs }}>
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
  </PlayErrorlogsContext.Provider>
}

export * from "./types"
export * from "./context"
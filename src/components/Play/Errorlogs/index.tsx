import { useState } from "react";
import React from "react";
import { PlayErrorlogsContext } from "../../../context/PlayErrorLogsContext";
import { PlayErrorlog } from "./types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useThemeSettings } from "../../../hooks";

export const PlayErrorlogs = (props: { children: JSX.Element }) => {
  const [error_logs, setErrorLogs] = useState([] as PlayErrorlog[]);
  const { theme, settings } = useThemeSettings();

  const removeErrorLogs = (items: any) => {
    const target_quizzes: any = {};
    items.forEach((item: any) => { target_quizzes[`${item.subject} - ${item.title}`] = false });
    setErrorLogs(error_logs.filter(error_log => {
      return target_quizzes[error_log.quiz] === undefined
    }))
  }

  return <PlayErrorlogsContext.Provider value={{ removeErrorLogs, error_logs, setErrorLogs }}>
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
              <div className="PlayErrorLogs-content-item">{error_log.quiz}: {error_log.target}, {error_log.message}</div></CSSTransition>
          ))}
        </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
      </div>
    </div>
    {props.children}
  </PlayErrorlogsContext.Provider>
}

export * from "./types"
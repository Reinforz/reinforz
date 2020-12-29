import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useThemeSettings } from "../../../hooks";
import { PlayErrorlog, PlayErrorlogsContext } from "../"

import "./style.scss";

export const PlayErrorlogs = () => {
  const [error_logs, setErrorLogs] = useState([] as PlayErrorlog[]);
  const { theme, settings } = useThemeSettings();

  return <PlayErrorlogsContext.Provider value={{ error_logs, setErrorLogs }}>
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
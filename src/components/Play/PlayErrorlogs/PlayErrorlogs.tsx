import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useThemeSettings } from '../../../hooks';
import { PlayContext } from '../Play';

export default function PlayErrorlogs() {
  const { theme, settings } = useThemeSettings();
  const { errorLogs } = useContext(PlayContext)

  return <div className="PlayErrorLogs" style={{ backgroundColor: theme.color.base, color: theme.palette.text.secondary }}>
    <div className="PlayErrorLogs-header" style={{ backgroundColor: theme.color.dark }}>Errors {"&"} Warnings</div>
    <div className="PlayErrorLogs-content" style={{ backgroundColor: theme.color.dark }}>
      {errorLogs.length > 0 ? <TransitionGroup component={null}>
        {errorLogs.map((errorLog, index) => (
          <CSSTransition
            key={errorLog._id + index}
            timeout={{
              enter: (index + 1) * 250,
              exit: (index + 1) * 250
            }}
            classNames={settings.animation ? "fade" : undefined}
            appear
            style={{ backgroundColor: errorLog.level === "ERROR" ? theme.palette.error.main : theme.palette.warning.main, color: theme.palette.text.primary }}
          >
            <div className="PlayErrorLogs-content-item">{errorLog.quiz}: {errorLog.target}, {errorLog.message}</div></CSSTransition>
        ))}
      </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
    </div>
  </div>
}
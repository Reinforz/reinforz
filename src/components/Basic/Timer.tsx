import { useTheme } from "@material-ui/styles";
import React from "react";

import useTimer from "../../hooks/useTimer";

import { TimerProps, TimerRProps, ExtendedTheme } from "../../types";

import "./Timer.scss";

export default function (props: TimerProps) {

  const { timeout, displayTime } = useTimer(props.timeout, props.onTimerEnd);

  const theme = useTheme() as ExtendedTheme

  return props.children({
    TimerComponent: <div style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} className="Timer">{displayTime()}</div>,
    TimerState: { timeout },
  } as TimerRProps);
}
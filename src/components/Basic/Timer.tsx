import { useTheme } from "@material-ui/styles";
import React from "react";
import { useTimer } from "../../hooks";
import { ExtendedTheme, TimerProps, TimerRProps } from "../../types";
import "./Timer.scss";

export default function Timer(props: TimerProps) {

  const { timeout, displayTime } = useTimer(props.timeout, props.onTimerEnd);

  const theme = useTheme() as ExtendedTheme

  return props.children({
    TimerComponent: <div style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} className="Timer">{displayTime()}</div>,
    TimerState: { timeout },
  } as TimerRProps);
}
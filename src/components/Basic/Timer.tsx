import { useTheme } from "@material-ui/styles";
import React, { useContext, useEffect, useState } from "react";

import SettingsContext from "../../context/SettingsContext";

import { TimerProps, TimerRProps, ExtendedTheme, ISettings } from "../../types";

import "./Timer.scss";

const tic = new Audio(process.env.PUBLIC_URL + "/sounds/tic.mp3");
tic.volume = 0.5;

export default function (props: TimerProps) {
  const settings = useContext(SettingsContext) as ISettings;

  const [timeout, setTimeout] = useState(props.timeout);

  const theme = useTheme() as ExtendedTheme

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeout !== 0)
        setTimeout((seconds) => {
          if (settings.sound) tic.play();
          return seconds - 1
        })
      else
        props.onTimerEnd()
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  })

  const displayTime = () => {
    const min = Math.floor(timeout / 60);
    const sec = timeout % 60;
    return `0${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  return props.children({
    TimerComponent: <div style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} className="Timer">{displayTime()}</div>,
    TimerState: { timeout },
  } as TimerRProps);
}
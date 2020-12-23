import { useEffect, useState, useContext } from "react";

import { SettingsState } from "../components/Settings";

import { SettingsContext } from "../context";

const tic = new Audio(process.env.PUBLIC_URL + "/sounds/tic.mp3");
tic.volume = 0.5;

export default function (limit: number, onTimerEnd: any) {
  const [timeout, setTimeout] = useState(limit);

  const settings = useContext(SettingsContext) as SettingsState;

  const displayTime = () => {
    const min = Math.floor(timeout / 60);
    const sec = timeout % 60;
    return `0${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeout !== 0)
        setTimeout((seconds) => {
          if (settings.sound) tic.play();
          return seconds - 1
        })
      else
        onTimerEnd()
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  })

  return {
    timeout,
    displayTime
  }
}
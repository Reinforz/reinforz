import { useState } from "react";

import useThemeSettings from "./useThemeSettings";

const switch_off = new Audio(process.env.PUBLIC_URL + "/sounds/switch-off.mp3");
const switch_on = new Audio(process.env.PUBLIC_URL + "/sounds/switch-on.mp3");
switch_off.volume = 0.25;
switch_on.volume = 0.25;

export default function <T>(initial: T | (() => T), toggles: [T, T], key?: string) {
  const [toggle, setToggle] = useState(() =>
    (key ? localStorage.getItem(key) : initial) as T
  );
  const { settings } = useThemeSettings();

  return {
    current_toggle: toggle,
    setToggle,
    toggle: () => {
      if (settings.sound && toggle === toggles[0]) switch_off.play();
      if (settings.sound && toggle === toggles[1]) switch_on.play();
      const alternate = toggle === toggles[1] ? toggles[0] : toggles[1];
      if (key) localStorage.setItem(key, (alternate as any).toString());
      setToggle(alternate)
    }
  }
}
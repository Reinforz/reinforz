import { useState } from "react";
import useThemeSettings from "./useThemeSettings";

export default function useToggle<T>(initial: T | (() => T), toggles: [T, T], key?: string) {
  const [toggle, setToggle] = useState(() => {
    let value = initial;
    if (key) {
      let temp = localStorage.getItem(key);
      if (temp)
        value = temp as any;
    }
    return value as T
  });
  const { settings, sounds: { switch_off, switch_on } } = useThemeSettings();
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
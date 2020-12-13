import { useTheme } from "@material-ui/styles";
import { useContext } from "react";

import SettingsContext from "../context/SettingsContext";

import { SettingsState } from "../components/Settings";
import { ExtendedTheme } from "../types";

const sounds: any = {};

['pop_on', 'pop_off', 'remove', 'switch_off', 'switch_on', 'swoosh', 'reset', 'horn', 'click', 'option_click'].forEach(sound_url => {
  const audio = new Audio(process.env.PUBLIC_URL + `/sounds/${sound_url}.mp3`);
  audio.volume = 0.5;
  sounds[sound_url] = audio;
});

export default function () {
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as SettingsState;
  return { theme, settings, sounds }
}
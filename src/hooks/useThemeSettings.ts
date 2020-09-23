import { useTheme } from "@material-ui/styles";
import { useContext } from "react";

import SettingsContext from "../context/SettingsContext";

import { ExtendedTheme, ISettings } from "../types";

export default function () {
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;
  return { theme, settings }
}
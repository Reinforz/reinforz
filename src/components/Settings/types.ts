import { AllowedTheme } from "../../types";

export interface SettingsState {
  theme: AllowedTheme,
  animation: boolean,
  sound: boolean,
  hovertips: boolean
}

export interface SettingsProps {
  settings: SettingsState,
  setSettings: (settings: SettingsState) => any
}
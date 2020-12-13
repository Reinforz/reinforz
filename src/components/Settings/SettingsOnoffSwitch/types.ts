import { SettingsState } from "..";

export interface SettingsSwitchProps {
  settings: SettingsState,
  prop: keyof SettingsState,
  setSettings: (settings: SettingsState) => void
}


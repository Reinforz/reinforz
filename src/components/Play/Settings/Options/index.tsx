import { Button } from "@material-ui/core";
import React from "react";

import { BasicCheckbox } from "../../../Basic";

import { PlaySettingsOptionsState, PlaySettingsOptionsProps } from "./types";

import { useThemeSettings } from "../../../../hooks";
import "./style.scss";

const PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as PlaySettingsOptionsState;

export function PlaySettingsOptions({ play_settings_options, setPlaySettingsOptions }: PlaySettingsOptionsProps) {
  const { theme, settings, sounds: { reset } } = useThemeSettings();

  return <div className="Play-Settings-item Play-Settings-Options">
    <div className="Play-Settings-item-header Play-Settings-Options-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Options</div>
    <div className="Play-Settings-item-content Play-Settings-Options-content">
      <BasicCheckbox name={"shuffle_options"} checked={play_settings_options.shuffle_options} onChange={(event, checked) => (setPlaySettingsOptions({
        ...play_settings_options,
        [event.target.name]: checked
      }))} />

      <BasicCheckbox name={"shuffle_quizzes"} checked={play_settings_options.shuffle_quizzes} disabled={play_settings_options.flatten_mix} onChange={(event, checked) => (setPlaySettingsOptions({
        ...play_settings_options,
        [event.target.name]: checked
      }))} />

      <BasicCheckbox name={"shuffle_questions"} checked={play_settings_options.shuffle_questions} disabled={play_settings_options.flatten_mix} onChange={(event, checked) => (setPlaySettingsOptions({
        ...play_settings_options,
        [event.target.name]: checked
      }))} />

      <BasicCheckbox name={"instant_feedback"} checked={play_settings_options.instant_feedback} onChange={(event, checked) => (setPlaySettingsOptions({
        ...play_settings_options,
        [event.target.name]: checked
      }))} />

      <BasicCheckbox name={"flatten_mix"} checked={play_settings_options.flatten_mix} onChange={(event, checked) => (setPlaySettingsOptions({
        ...play_settings_options,
        shuffle_questions: checked,
        shuffle_quizzes: checked,
        [event.target.name]: checked
      }))} />

      <BasicCheckbox name={"disable_timer"} checked={play_settings_options.disable_timer} onChange={(event, checked) => (setPlaySettingsOptions({
        ...play_settings_options,
        [event.target.name]: checked
      }))} />
    </div>

    <Button className="Play-Settings-item-reset_button Play-Settings-Options-reset_button" variant="contained" color="primary" onClick={() => {
      if (settings.sound) reset.play()
      setPlaySettingsOptions(PLAY_OPTIONS_STATE)
    }}>Reset</Button>

  </div>
}

export const DEFAULT_PLAY_OPTIONS_STATE = JSON.parse(JSON.stringify(PLAY_OPTIONS_STATE)) as PlaySettingsOptionsState

export * from "./types";
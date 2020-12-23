import React from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, InputLabel, TextField } from "@material-ui/core";

import { useThemeSettings } from "../../../../hooks";
import { QuestionDifficulty, QuestionType } from "../../../../types";
import { IPlaySettingsFiltersState, PlaySettingsFiltersProps } from "./types";

const PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState;

export default function ({ play_settings_filters, setPlaySettingsFilters }: PlaySettingsFiltersProps) {
  const { theme, settings, sounds: { reset, click, pop_off, pop_on } } = useThemeSettings();

  return <div className="PlaySettings-group PlaySettings-group--filters">
    <div className="PlaySettings-group-header PlaySettings-group-header--filters" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
      Filters
    </div>
    <div className="PlaySettings-group-content PlaySettings-group-content--filters">
      <FormGroup>
        <InputLabel>Time Allocated range</InputLabel>
        <TextField type="number" inputProps={{ max: play_settings_filters.time_allocated[1], step: 5, min: 0 }} value={play_settings_filters.time_allocated[0]} onChange={(e) => {
          if (settings.sound) click.play()
          setPlaySettingsFilters({ ...play_settings_filters, time_allocated: [(e.target as any).value, play_settings_filters.time_allocated[1]] })
        }} />
        <TextField type="number" inputProps={{ min: play_settings_filters.time_allocated[0], step: 5, max: 60 }} value={play_settings_filters.time_allocated[1]} onChange={(e) => {
          if (settings.sound) click.play()
          setPlaySettingsFilters({ ...play_settings_filters, time_allocated: [play_settings_filters.time_allocated[0], (e.target as any).value] })
        }} />
      </FormGroup>
      <FormGroup>
        <InputLabel>Exluded Difficulty</InputLabel>
        {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={play_settings_filters.excluded_difficulty.includes(difficulty as QuestionDifficulty)} name={difficulty} onChange={(e) => {
          if ((e.target as any).checked) {
            if (settings.sound) pop_on.play()
            setPlaySettingsFilters({ ...play_settings_filters, excluded_difficulty: play_settings_filters.excluded_difficulty.concat(difficulty as QuestionDifficulty) });
          }
          else {
            if (settings.sound) pop_off.play()
            setPlaySettingsFilters({ ...play_settings_filters, excluded_difficulty: play_settings_filters.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
          }
        }}
          color="primary" />} />)}
      </FormGroup>
      <FormGroup>
        <InputLabel>Exluded Type</InputLabel>
        {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={play_settings_filters.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
          if ((e.target as any).checked) {
            if (settings.sound) pop_on.play()
            setPlaySettingsFilters({ ...play_settings_filters, excluded_types: play_settings_filters.excluded_types.concat(type as QuestionType) });
          }
          else {
            if (settings.sound) pop_off.play()
            setPlaySettingsFilters({ ...play_settings_filters, excluded_types: play_settings_filters.excluded_types.filter(excluded_type => excluded_type !== type) })
          }
        }}
          color="primary" />} />)}
      </FormGroup>
    </div>
    <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
      if (settings.sound) reset.play()
      setPlaySettingsFilters(PLAY_FILTERS_STATE)
    }}>Reset</Button>
  </div>
}

export * from "./types"
export const DEFAULT_PLAY_FILTERS_STATE = JSON.parse(JSON.stringify(PLAY_FILTERS_STATE)) as IPlaySettingsFiltersState

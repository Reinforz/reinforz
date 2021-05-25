import { Button, Checkbox, FormControlLabel, FormGroup, InputLabel, TextField } from "@material-ui/core";
import { OptionsObject, useSnackbar } from "notistack";
import React, { useContext } from "react";
import { useThemeSettings } from "../../../hooks";
import { CheckboxGroup } from '../../../shared';
import { IPlaySettingsOptionsState } from "../../../types";
import { createDefaultPlaySettingsFiltersState, createDefaultPlaySettingsOptionsState } from "../../../utils";
import { PlayContext } from "../Play";
import "./PlaySettings.scss";

const enqueueSnackbarOptionsObject: OptionsObject = {
  variant: 'error',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
}

export default function PlaySettings() {
  const { setPlaying, selectedQuizzes, playSettings, setPlaySettings, filteredQuizzes } = useContext(PlayContext);
  const { theme } = useThemeSettings();
  const { enqueueSnackbar } = useSnackbar();

  const filteredQuestions = filteredQuizzes.reduce((acc, filteredQuiz) => acc += filteredQuiz.questions.length, 0);

  return <div className="PlaySettings" style={{ backgroundColor: theme.color.base, color: theme.palette.text.primary }}>
    <div className="PlaySettings-group PlaySettings-group--options">
      <div className="PlaySettings-group-header PlaySettings-group-header--options" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Options</div>
      <div className="PlaySettings-group-content PlaySettings-group-content--options">
        {Object.keys(playSettings.options).map((key, index) => {
          let isDisabled = false;
          if (Boolean(key.match(/(shuffle_questions|shuffle_quizzes)/) && playSettings.options.flatten_mix)) isDisabled = true;
          if (selectedQuizzes.length <= 1 && key === "shuffle_quizzes") isDisabled = true;
          return <FormControlLabel key={key + index}
            control={
              <Checkbox
                disabled={isDisabled}
                checked={playSettings.options[key as keyof IPlaySettingsOptionsState]}
                onChange={(event, checked) => {
                  if (key === "flatten_mix") setPlaySettings({ ...playSettings, options: { ...playSettings.options, [event.target.name]: checked, shuffle_questions: checked, shuffle_quizzes: checked } })
                  else setPlaySettings({ ...playSettings, options: { ...playSettings.options, [event.target.name]: checked } })
                }}
                name={key}
                color="primary"
              />
            }
            label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
          />
        })}
      </div>
      <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
        setPlaySettings({ ...playSettings, options: createDefaultPlaySettingsOptionsState() })
      }}>Reset</Button>
    </div>
    <div className="PlaySettings-group PlaySettings-group--filters">
      <div className="PlaySettings-group-header PlaySettings-group-header--filters" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
        Filters
      </div>
      <div className="PlaySettings-group-content PlaySettings-group-content--filters">
        <FormGroup>
          <InputLabel>Time Allocated range</InputLabel>
          <TextField type="number" inputProps={{ max: playSettings.filters.time_allocated[1], step: 5, min: 0 }} value={playSettings.filters.time_allocated[0]} onChange={(e) => {
            setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, time_allocated: [(e.target as any).value, playSettings.filters.time_allocated[1]] } })
          }} />
          <TextField type="number" inputProps={{ min: playSettings.filters.time_allocated[0], step: 5, max: 60 }} value={playSettings.filters.time_allocated[1]} onChange={(e) => {
            setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, time_allocated: [playSettings.filters.time_allocated[0], (e.target as any).value] } })
          }} />
        </FormGroup>

        <CheckboxGroup label={'Excluded Difficulty'} items={['Beginner', 'Intermediate', 'Advanced']} setState={(filters: any) => {
          setPlaySettings({ ...playSettings, filters })
        }} stateKey={'excluded_difficulty'} state={playSettings.filters} />

        <CheckboxGroup label={'Excluded Type'} items={['FIB', 'MS', 'MCQ', "Snippet"]} setState={(filters: any) => {
          setPlaySettings({ ...playSettings, filters })
        }} stateKey={'excluded_types'} state={playSettings.filters} />
      </div>
      <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
        setPlaySettings({ ...playSettings, filters: createDefaultPlaySettingsFiltersState() })
      }}>Reset</Button>

    </div>
    <div className="PlaySettings-total" style={{ backgroundColor: theme.color.dark, color: filteredQuestions === 0 ? theme.palette.error.main : theme.palette.success.main }}>{filteredQuestions} Questions</div>
    <Button disabled={(filteredQuestions === 0 && selectedQuizzes.length !== 0) || selectedQuizzes.length === 0} className="PlaySettings-button" color="primary" variant="contained" onClick={() => {
      if (selectedQuizzes.length > 0 && filteredQuestions > 0) {
        setPlaying(true)
      }
      else if (filteredQuestions === 0 && selectedQuizzes.length !== 0) {
        enqueueSnackbar('You must have at least one question to play', enqueueSnackbarOptionsObject)
      }
      else if (selectedQuizzes.length === 0) {
        enqueueSnackbar('You must have at least one quiz selected', enqueueSnackbarOptionsObject)
      }
    }}>Start</Button>
  </div>
}
import React, { useState } from "react";
import { Button, FormControlLabel, Checkbox, FormGroup, TextField, InputLabel } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useTheme, darken } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import { PlaySettingsProps, QuestionDifficulty, QuestionType, IPlaySettingsOptionsState, IPlaySettingsFiltersState } from "../../../types";

import "./PlaySettings.scss";

function PlaySettings(props: PlaySettingsProps) {
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;
  const theme = useTheme();

  const play_options_state = (PLAY_SETTINGS ? PLAY_SETTINGS.play_options : { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false }) as IPlaySettingsOptionsState;
  const play_filters_state = (PLAY_SETTINGS ? PLAY_SETTINGS.play_filters : { time_allocated: [15, 60], excluded_difficulty: [] as QuestionDifficulty[], excluded_types: [] as QuestionType[] }) as IPlaySettingsFiltersState;
  const [play_options, setPlaySettingsOptions] = useState(play_options_state);
  const [play_filters, setPlayFiltersOptions] = useState(play_filters_state);
  const { enqueueSnackbar } = useSnackbar();
  type play_options_keys = keyof IPlaySettingsOptionsState;

  return (
    props.children({
      PlaySettingsState: {
        play_options,
        play_filters,
      },
      PlaySettingsComponent: <div className="PlaySettings" style={{ backgroundColor: theme.palette.type === "dark" ? darken(grey[800], 0.25) : grey[200], color: theme.palette.text.primary }}>
        <div className="PlaySettings-header PlaySettings-header--options" style={{ backgroundColor: theme.palette.type === "dark" ? grey[900] : grey[300], color: theme.palette.text.primary }}>Options</div>
        <div className="PlaySettings-content PlaySettings-content--options">
          {Object.keys(play_options_state).map((key, index) => {
            let isDisabled = false;
            if (Boolean(key.match(/(shuffle_questions|shuffle_quizzes)/) && play_options.flatten_mix)) isDisabled = true;
            if (props.selectedQuizzes.length <= 1 && key === "shuffle_quizzes") isDisabled = true;
            return <FormControlLabel key={key + index}
              control={
                <Checkbox
                  disabled={isDisabled}
                  checked={play_options[key as play_options_keys]}
                  onChange={(event, checked) => {
                    if (key === "flatten_mix") setPlaySettingsOptions({ ...play_options, [event.target.name]: checked, shuffle_questions: checked, shuffle_quizzes: checked })
                    else setPlaySettingsOptions({ ...play_options, [event.target.name]: checked })
                  }}
                  name={key}
                  color="primary"
                />
              }
              label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
            />
          })}
        </div>
        <div className="PlaySettings-header PlaySettings-header--filters" style={{ backgroundColor: theme.palette.type === "dark" ? grey[900] : grey[300], color: theme.palette.text.primary }}>
          Filters
        </div>
        <div className="PlaySettings-content PlaySettings-content--filters">
          <FormGroup>
            <TextField type="number" inputProps={{ max: play_filters.time_allocated[1], step: 5, min: 0 }} value={play_filters.time_allocated[0]} onChange={(e) => setPlayFiltersOptions({ ...play_filters, time_allocated: [(e.target as any).value, play_filters.time_allocated[1]] })} label="Time Allocated min" />
            <TextField type="number" inputProps={{ min: play_filters.time_allocated[0], step: 5, max: 60 }} value={play_filters.time_allocated[1]} onChange={(e) => setPlayFiltersOptions({ ...play_filters, time_allocated: [play_filters.time_allocated[0], (e.target as any).value,] })} label="Time Allocated max" />
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Difficulty</InputLabel>
            {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={play_filters.excluded_difficulty.includes(difficulty as QuestionDifficulty)} name={difficulty} onChange={(e) => {
              if ((e.target as any).checked)
                setPlayFiltersOptions({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.concat(difficulty as QuestionDifficulty) });
              else setPlayFiltersOptions({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
            }}
              color="primary" />} />)}
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Type</InputLabel>
            {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={play_filters.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
              if ((e.target as any).checked)
                setPlayFiltersOptions({ ...play_filters, excluded_types: play_filters.excluded_types.concat(type as QuestionType) });
              else setPlayFiltersOptions({ ...play_filters, excluded_types: play_filters.excluded_types.filter(excluded_type => excluded_type !== type) })
            }}
              color="primary" />} />)}
          </FormGroup>
        </div>
        <Button className="PlaySettings-button" color="primary" variant="contained" onClick={() => {
          if (props.selectedQuizzes.length > 0)
            props.setPlaying(true)
          else enqueueSnackbar('You must have atleast one quiz selected', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          })
        }}>Start</Button>
      </div>
    })

  );
}

export default PlaySettings;
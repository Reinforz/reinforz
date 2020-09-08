import React, { useState } from "react";
import { Button, FormControlLabel, Checkbox, FormGroup, TextField, InputLabel } from "@material-ui/core";
import { IPlayOptions, IPlayFilters, Difficulty, QuestionType } from "../types";
import { useSnackbar } from "notistack";

interface PlaySettingsProps {
  children: any,
  selectedQuizzes: string[],
  setPlaying: (isPlaying: boolean) => any
}

function PlaySettings(props: PlaySettingsProps) {
  const play_options_state = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false };
  const play_filters_state = { time_allocated: [15, 60], excluded_difficulty: [] as Difficulty[], excluded_types: [] as QuestionType[] } as IPlayFilters;
  type play_options_keys = keyof IPlayOptions;
  const [play_options, setPlayOptions] = useState(play_options_state as IPlayOptions);
  const [play_filters, setPlayFilters] = useState(play_filters_state);
  const { enqueueSnackbar } = useSnackbar();

  return (
    props.children({
      play_options,
      PlaySettings: <div className="Play-options">
        <div className="Play-options-header">Options</div>
        <div className="Play-options-content">
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
                    if (key === "flatten_mix") setPlayOptions({ ...play_options, [event.target.name]: checked, shuffle_questions: checked, shuffle_quizzes: checked })
                    else setPlayOptions({ ...play_options, [event.target.name]: checked })
                  }}
                  name={key}
                  color="primary"
                />
              }
              label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
            />
          })}
        </div>
        <div className="Play-filters-header">
          Filters
        </div>
        <div className="Play-filters-content">
          <FormGroup>
            <TextField type="number" inputProps={{ max: play_filters.time_allocated[1], step: 5 }} value={play_filters.time_allocated[0]} onChange={(e) => setPlayFilters({ ...play_filters, time_allocated: [(e.target as any).value, play_filters.time_allocated[1]] })} label="Time Allocated min" />
            <TextField type="number" inputProps={{ min: play_filters.time_allocated[0], step: 5 }} value={play_filters.time_allocated[1]} onChange={(e) => setPlayFilters({ ...play_filters, time_allocated: [play_filters.time_allocated[0], (e.target as any).value,] })} label="Time Allocated max" />
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Difficulty</InputLabel>
            {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={play_filters.excluded_difficulty.includes(difficulty as Difficulty)} name={difficulty} onChange={(e) => {
              if ((e.target as any).checked)
                setPlayFilters({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.concat(difficulty as Difficulty) });
              else setPlayFilters({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
            }}
              color="primary" />} />)}
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Difficulty</InputLabel>
            {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={play_filters.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
              if ((e.target as any).checked)
                setPlayFilters({ ...play_filters, excluded_types: play_filters.excluded_types.concat(type as QuestionType) });
              else setPlayFilters({ ...play_filters, excluded_types: play_filters.excluded_types.filter(excluded_type => excluded_type !== type) })
            }}
              color="primary" />} />)}
          </FormGroup>
        </div>
        <Button color="primary" style={{ margin: "0 auto", fontSize: "1rem" }} variant="contained" onClick={() => {
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
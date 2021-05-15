import { Button, Checkbox, FormControlLabel, FormGroup, InputLabel, TextField } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { useThemeSettings } from "../../../hooks";
import { IPlaySettingsFiltersState, IPlaySettingsOptionsState, QuestionDifficulty, QuestionType } from "../../../types";
import { PlayContext } from "../Play";
import "./PlaySettings.scss";

const DEFAULT_PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState,
  DEFAULT_PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState;

export default function PlaySettings() {
  const { setPlaying, selectedQuizzes, playSettings, setPlaySettings, filteredQuizzes } = useContext(PlayContext);
  const { theme, settings, sounds } = useThemeSettings();
  const { pop_off, pop_on, swoosh, reset, horn, click } = sounds;
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
                onClick={(e) => {
                  if ((e.target as any).checked && settings.sound)
                    pop_on.play();
                  else if (settings.sound) pop_off.play()
                }}
              />
            }
            label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
          />
        })}
      </div>
      <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
        if (settings.sound) reset.play()
        setPlaySettings({ ...playSettings, options: DEFAULT_PLAY_OPTIONS_STATE })
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
            if (settings.sound) click.play()
            setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, time_allocated: [(e.target as any).value, playSettings.filters.time_allocated[1]] } })
          }} />
          <TextField type="number" inputProps={{ min: playSettings.filters.time_allocated[0], step: 5, max: 60 }} value={playSettings.filters.time_allocated[1]} onChange={(e) => {
            if (settings.sound) click.play()
            setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, time_allocated: [playSettings.filters.time_allocated[0], (e.target as any).value] } })
          }} />
        </FormGroup>
        <FormGroup>
          <InputLabel>Excluded Difficulty</InputLabel>
          {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={playSettings.filters.excluded_difficulty.includes(difficulty as QuestionDifficulty)} name={difficulty} onChange={(e) => {
            if ((e.target as any).checked) {
              if (settings.sound) pop_on.play()
              setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, excluded_difficulty: playSettings.filters.excluded_difficulty.concat(difficulty as QuestionDifficulty) } });
            }
            else {
              if (settings.sound) pop_off.play()
              setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, excluded_difficulty: playSettings.filters.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) } })
            }
          }}
            color="primary" />} />)}
        </FormGroup>
        <FormGroup>
          <InputLabel>Excluded Type</InputLabel>
          {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={playSettings.filters.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
            if ((e.target as any).checked) {
              if (settings.sound) pop_on.play()
              setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, excluded_types: playSettings.filters.excluded_types.concat(type as QuestionType) } });
            }
            else {
              if (settings.sound) pop_off.play()
              setPlaySettings({ ...playSettings, filters: { ...playSettings.filters, excluded_types: playSettings.filters.excluded_types.filter(excluded_type => excluded_type !== type) } })
            }
          }}
            color="primary" />} />)}
        </FormGroup>
      </div>
      <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
        if (settings.sound) reset.play()
        setPlaySettings({ ...playSettings, filters: DEFAULT_PLAY_FILTERS_STATE })
      }}>Reset</Button>

    </div>
    <div className="PlaySettings-total" style={{ backgroundColor: theme.color.dark, color: filteredQuestions === 0 ? theme.palette.error.main : theme.palette.success.main }}>{filteredQuestions} Questions</div>
    <Button disabled={(filteredQuestions === 0 && selectedQuizzes.length !== 0) || selectedQuizzes.length === 0} className="PlaySettings-button" color="primary" variant="contained" onClick={() => {
      if (selectedQuizzes.length > 0 && filteredQuestions > 0) {
        if (settings.sound) swoosh.play();
        setPlaying(true)
      }
      else if (filteredQuestions === 0 && selectedQuizzes.length !== 0) {
        if (settings.sound) horn.play()
        enqueueSnackbar('You must have at least one question to play', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        })
      }
      else if (selectedQuizzes.length === 0) {
        if (settings.sound) horn.play()
        enqueueSnackbar('You must have at least one quiz selected', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        })
      }
    }}>Start</Button>
  </div>
}
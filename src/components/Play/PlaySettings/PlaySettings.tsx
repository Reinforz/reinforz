import React, { useState } from "react";
import { Button, FormControlLabel, Checkbox, FormGroup, TextField, InputLabel } from "@material-ui/core";
import { useSnackbar } from "notistack";

import useThemeSettings from "../../../hooks/useThemeSettings";

import shuffle from "../../../utils/arrayShuffler";

import { PlaySettingsProps, QuestionDifficulty, QuestionType, IPlaySettingsFiltersState, QuizInputFull, QuestionInputFull, IPlaySettingsRProps } from "../../../types";

import "./PlaySettings.scss";
import PlaySettingsOptions from "./PlaySettingsOptions";
import { IPlaySettingsOptionsState } from "./PlaySettingsOptions/types";

const DEFAULT_PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState;

const DEFAULT_PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [] as QuestionDifficulty[], excluded_types: [] as QuestionType[] } as IPlaySettingsFiltersState;

export default function (props: PlaySettingsProps) {
  const { quizzes, selectedQuizzes } = props;
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;
  const { theme, settings, sounds } = useThemeSettings();

  const { pop_off, pop_on, swoosh, reset, horn, click } = sounds;

  const play_options_state = (PLAY_SETTINGS?.play_options ?? DEFAULT_PLAY_OPTIONS_STATE) as IPlaySettingsOptionsState;
  const play_filters_state = (PLAY_SETTINGS?.play_filters ?? DEFAULT_PLAY_FILTERS_STATE) as IPlaySettingsFiltersState;
  const [play_options, setPlaySettingsOptions] = useState(play_options_state);
  const [play_filters, setPlaySettingsFilters] = useState(play_filters_state);
  const { enqueueSnackbar } = useSnackbar();
  const PlaySettingsState = {
    play_options,
    play_filters,
  }

  let filtered_quizzes = quizzes.filter(quiz => selectedQuizzes.includes(quiz._id)) as QuizInputFull[];
  const filtered_questions: QuestionInputFull[] = [];
  if (play_options.shuffle_quizzes && !play_options.flatten_mix) filtered_quizzes = shuffle(filtered_quizzes);
  if (play_options.shuffle_questions && !play_options.flatten_mix) filtered_quizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
  filtered_quizzes.forEach(quiz => {
    filtered_questions.push(...quiz.questions.filter(question => !play_filters.excluded_difficulty.includes(question.difficulty as QuestionDifficulty) && !play_filters.excluded_types.includes(question.type as QuestionType) && play_filters.time_allocated[0] <= question.time_allocated && play_filters.time_allocated[1] >= question.time_allocated));
  });

  return (
    props.children({
      PlaySettingsExtra: {
        filtered_questions,
        selected_quizzes: filtered_quizzes.map(filtered_quiz => ({ _id: filtered_quiz._id, title: filtered_quiz.title, subject: filtered_quiz.subject }))
      },
      PlaySettingsState,
      PlaySettingsComponent: <div className="PlaySettings" style={{ backgroundColor: theme.color.base, color: theme.palette.text.primary }}>
        <PlaySettingsOptions play_settings_options={play_options} setPlaySettingsOptions={setPlaySettingsOptions} />
        <div className="PlaySettings-group PlaySettings-group--filters">
          <div className="PlaySettings-group-header PlaySettings-group-header--filters" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
            Filters
          </div>
          <div className="PlaySettings-group-content PlaySettings-group-content--filters">
            <FormGroup>
              <InputLabel>Time Allocated range</InputLabel>
              <TextField type="number" inputProps={{ max: play_filters.time_allocated[1], step: 5, min: 0 }} value={play_filters.time_allocated[0]} onChange={(e) => {
                if (settings.sound) click.play()
                setPlaySettingsFilters({ ...play_filters, time_allocated: [(e.target as any).value, play_filters.time_allocated[1]] })
              }} />
              <TextField type="number" inputProps={{ min: play_filters.time_allocated[0], step: 5, max: 60 }} value={play_filters.time_allocated[1]} onChange={(e) => {
                if (settings.sound) click.play()
                setPlaySettingsFilters({ ...play_filters, time_allocated: [play_filters.time_allocated[0], (e.target as any).value] })
              }} />
            </FormGroup>
            <FormGroup>
              <InputLabel>Exluded Difficulty</InputLabel>
              {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={play_filters.excluded_difficulty.includes(difficulty as QuestionDifficulty)} name={difficulty} onChange={(e) => {
                if ((e.target as any).checked) {
                  if (settings.sound) pop_on.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.concat(difficulty as QuestionDifficulty) });
                }
                else {
                  if (settings.sound) pop_off.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
                }
              }}
                color="primary" />} />)}
            </FormGroup>
            <FormGroup>
              <InputLabel>Exluded Type</InputLabel>
              {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={play_filters.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
                if ((e.target as any).checked) {
                  if (settings.sound) pop_on.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_types: play_filters.excluded_types.concat(type as QuestionType) });
                }
                else {
                  if (settings.sound) pop_off.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_types: play_filters.excluded_types.filter(excluded_type => excluded_type !== type) })
                }
              }}
                color="primary" />} />)}
            </FormGroup>
          </div>
          <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
            if (settings.sound) reset.play()
            setPlaySettingsFilters(DEFAULT_PLAY_FILTERS_STATE)
          }}>Reset</Button>

        </div>
        <div className="PlaySettings-total" style={{ backgroundColor: theme.color.dark, color: filtered_questions.length === 0 ? theme.palette.error.main : theme.palette.success.main }}>{filtered_questions.length} Questions</div>
        <Button disabled={(filtered_questions.length === 0 && selectedQuizzes.length !== 0) || selectedQuizzes.length === 0} className="PlaySettings-button" color="primary" variant="contained" onClick={() => {
          if (props.selectedQuizzes.length > 0 && filtered_questions.length > 0) {
            if (settings.sound) swoosh.play();
            props.setPlaying(true)
          }
          else if (filtered_questions.length === 0 && selectedQuizzes.length !== 0) {
            if (settings.sound) horn.play()
            enqueueSnackbar('You must have atleast one question to play', {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            })
          }
          else if (selectedQuizzes.length === 0) {
            if (settings.sound) horn.play()
            enqueueSnackbar('You must have atleast one quiz selected', {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            })
          }
        }}>Start</Button>
      </div>
    } as IPlaySettingsRProps)
  );
}
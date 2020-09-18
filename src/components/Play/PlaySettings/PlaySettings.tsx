import React, { useContext, useState } from "react";
import { Button, FormControlLabel, Checkbox, FormGroup, TextField, InputLabel } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useTheme } from '@material-ui/core/styles';

import shuffle from "../../../utils/arrayShuffler";

import SettingsContext from "../../../context/SettingsContext";

import { PlaySettingsProps, QuestionDifficulty, QuestionType, IPlaySettingsOptionsState, IPlaySettingsFiltersState, ExtendedTheme, QuizInputFull, QuestionInputFull, IPlaySettingsRProps, ISettings } from "../../../types";

import "./PlaySettings.scss";

const DEFAULT_PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState;

const DEFAULT_PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [] as QuestionDifficulty[], excluded_types: [] as QuestionType[] } as IPlaySettingsFiltersState;

const playOn = new Audio(process.env.PUBLIC_URL + "/sounds/pop-on.mp3");
playOn.volume = 0.25;
const playOff = new Audio(process.env.PUBLIC_URL + "/sounds/pop-off.mp3");
playOff.volume = 0.25;
const resetSettings = new Audio(process.env.PUBLIC_URL + "/sounds/reset.mp3");
resetSettings.volume = 0.25;
const horn = new Audio(process.env.PUBLIC_URL + "/sounds/horn.mp3");
horn.volume = 0.25;
const click = new Audio(process.env.PUBLIC_URL + "/sounds/click.mp3");
click.volume = 0.25;
const swoosh = new Audio(process.env.PUBLIC_URL + "/sounds/swoosh.mp3");
swoosh.volume = 0.25;

export default function (props: PlaySettingsProps) {
  const { quizzes, selectedQuizzes } = props;
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;



  const play_options_state = (PLAY_SETTINGS ? PLAY_SETTINGS.play_options : DEFAULT_PLAY_OPTIONS_STATE) as IPlaySettingsOptionsState;
  const play_filters_state = (PLAY_SETTINGS ? PLAY_SETTINGS.play_filters : DEFAULT_PLAY_FILTERS_STATE) as IPlaySettingsFiltersState;
  const [play_options, setPlaySettingsOptions] = useState(play_options_state);
  const [play_filters, setPlaySettingsFilters] = useState(play_filters_state);
  const { enqueueSnackbar } = useSnackbar();
  type play_options_keys = keyof IPlaySettingsOptionsState;
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
        <div className="PlaySettings-group PlaySettings-group--options">
          <div className="PlaySettings-group-header PlaySettings-group-header--options" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Options</div>
          <div className="PlaySettings-group-content PlaySettings-group-content--options">
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
                    onClick={(e) => {
                      if ((e.target as any).checked && settings.sound)
                        playOn.play();
                      else if (settings.sound) playOff.play()
                    }}
                  />
                }
                label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
              />
            })}
          </div>
          <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
            if (settings.sound) resetSettings.play()
            setPlaySettingsOptions(DEFAULT_PLAY_OPTIONS_STATE)
          }}>Reset</Button>
        </div>
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
                  if (settings.sound) playOn.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.concat(difficulty as QuestionDifficulty) });
                }
                else {
                  if (settings.sound) playOff.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_difficulty: play_filters.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
                }
              }}
                color="primary" />} />)}
            </FormGroup>
            <FormGroup>
              <InputLabel>Exluded Type</InputLabel>
              {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={play_filters.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
                if ((e.target as any).checked) {
                  if (settings.sound) playOn.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_types: play_filters.excluded_types.concat(type as QuestionType) });
                }
                else {
                  if (settings.sound) playOff.play()
                  setPlaySettingsFilters({ ...play_filters, excluded_types: play_filters.excluded_types.filter(excluded_type => excluded_type !== type) })
                }
              }}
                color="primary" />} />)}
            </FormGroup>
          </div>
          <Button className="PlaySettings-group-button" variant="contained" color="primary" onClick={() => {
            if (settings.sound) resetSettings.play()
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
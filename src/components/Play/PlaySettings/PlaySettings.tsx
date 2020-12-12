import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useSnackbar } from "notistack";

import useThemeSettings from "../../../hooks/useThemeSettings";

import shuffle from "../../../utils/arrayShuffler";

import { PlaySettingsProps, QuestionDifficulty, QuestionType, QuizInputFull, QuestionInputFull, IPlaySettingsRProps } from "../../../types";

import "./PlaySettings.scss";
import PlaySettingsOptions, { IPlaySettingsOptionsState } from "./PlaySettingsOptions";
import PlaySettingsFilters, { IPlaySettingsFiltersState } from "./PlaySettingsFilters";

const DEFAULT_PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState;

const DEFAULT_PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState;

export default function (props: PlaySettingsProps) {
  const { quizzes, selectedQuizzes } = props;
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;
  const { theme, settings, sounds } = useThemeSettings();

  const { swoosh, horn, } = sounds;

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
        <PlaySettingsFilters play_settings_filters={play_filters} setPlaySettingsFilters={setPlaySettingsFilters} />
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
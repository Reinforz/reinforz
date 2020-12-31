import React, { useContext, useState } from "react";

import { useThemeSettings } from "../../../hooks";

import { arrayShuffler } from "../../../utils";

import { QuestionDifficulty, QuestionType, QuizInputFull, QuestionInputFull } from "../../../types";

import "./style.scss";

import { PlaySettingsOptions, PlaySettingsOptionsState, DEFAULT_PLAY_OPTIONS_STATE } from "./Options";
import { PlaySettingsFilters, PlaySettingsFiltersState, DEFAULT_PLAY_FILTERS_STATE } from "./Filters";
import { PlaySettingsButton } from "./Button";
import { PlayListContext, PlayTable, PlayUploadContext } from "..";

export function PlaySettings() {
  const { items: quizzes } = useContext(PlayUploadContext), { selectedItems } = useContext(PlayListContext);

  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;

  const { theme } = useThemeSettings();

  const [play_options, setPlaySettingsOptions] = useState((PLAY_SETTINGS?.play_options ?? DEFAULT_PLAY_OPTIONS_STATE) as PlaySettingsOptionsState);
  const [play_filters, setPlaySettingsFilters] = useState((PLAY_SETTINGS?.play_filters ?? DEFAULT_PLAY_FILTERS_STATE) as PlaySettingsFiltersState);

  let filtered_quizzes = quizzes.filter(quiz => selectedItems.includes(quiz._id)) as QuizInputFull[];
  const selected_quizzes = filtered_quizzes.map(filtered_quiz => ({ _id: filtered_quiz._id, title: filtered_quiz.title, subject: filtered_quiz.subject }))
  const filtered_questions: QuestionInputFull[] = [];
  if (play_options.shuffle_quizzes && !play_options.flatten_mix) filtered_quizzes = arrayShuffler(filtered_quizzes);
  if (play_options.shuffle_questions && !play_options.flatten_mix) filtered_quizzes.forEach(quiz => quiz.questions = arrayShuffler(quiz.questions));
  filtered_quizzes.forEach(quiz => {
    filtered_questions.push(...quiz.questions.filter(question => !play_filters.excluded_difficulty.includes(question.difficulty as QuestionDifficulty) && !play_filters.excluded_types.includes(question.type as QuestionType) && play_filters.time_allocated[0] <= question.time_allocated && play_filters.time_allocated[1] >= question.time_allocated));
  });

  return <>
    <PlayTable />
    <div className="Play-Settings" style={{ backgroundColor: theme.color.base, color: theme.palette.text.primary }}>
      <PlaySettingsOptions play_settings_options={play_options} setPlaySettingsOptions={setPlaySettingsOptions} />
      <PlaySettingsFilters play_settings_filters={play_filters} setPlaySettingsFilters={setPlaySettingsFilters} />
      <div className="Play-Settings-total_questions" style={{ backgroundColor: theme.color.dark, color: filtered_questions.length === 0 ? theme.palette.error.main : theme.palette.success.main }}>{filtered_questions.length} Questions</div>
      <PlaySettingsButton filtered_questions={filtered_questions} selected_quizzes_length={selected_quizzes.length} />
    </div>
  </>
}

export * from "./types"
export * from "./context"
export * from "./Options"
export * from "./Filters"
export * from "./Button"
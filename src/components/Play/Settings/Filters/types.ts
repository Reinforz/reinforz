import { QuestionDifficulty, QuestionType } from "../../../../types";

export interface PlaySettingsFiltersState {
  time_allocated: [number, number],
  excluded_difficulty: QuestionDifficulty[],
  excluded_types: QuestionType[],
}

export interface PlaySettingsFiltersProps {
  play_settings_filters: PlaySettingsFiltersState,
  setPlaySettingsFilters: (state: PlaySettingsFiltersState) => void
}
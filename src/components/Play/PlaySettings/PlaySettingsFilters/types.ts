import { QuestionDifficulty, QuestionType } from "../../../../types";

export interface IPlaySettingsFiltersState {
  time_allocated: [number, number],
  excluded_difficulty: QuestionDifficulty[],
  excluded_types: QuestionType[],
}

export interface PlaySettingsFiltersProps {
  play_settings_filters: IPlaySettingsFiltersState,
  setPlaySettingsFilters: (state: IPlaySettingsFiltersState) => void
}
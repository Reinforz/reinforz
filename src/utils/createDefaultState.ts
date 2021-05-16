import { IPlaySettingsFiltersState, IPlaySettingsOptionsState } from "../types";

export function createDefaultPlaySettingsOptionsState(){
  return { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState;
}

export function createDefaultPlaySettingsFiltersState(){
  return { time_allocated: [15, 60], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState
}

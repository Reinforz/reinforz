import { IPlaySettingsFiltersState, IPlaySettingsOptionsState, IReportFilterState } from "../types";

export function createDefaultPlaySettingsOptionsState(){
  return { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState;
}

export function createDefaultPlaySettingsFiltersState(){
  return { time_allocated: [5, 120], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState
}

export function createDefaultReportFilterState(){
  return { time_taken: [0, 60], verdict: 'mixed', hints_used: 'any', excluded_types: [], excluded_difficulty: [], excluded_quizzes: [], excluded_columns: [] } as IReportFilterState;
}
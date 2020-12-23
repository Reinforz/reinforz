export interface IPlaySettingsOptionsState {
  shuffle_options: boolean,
  shuffle_quizzes: boolean,
  shuffle_questions: boolean,
  instant_feedback: boolean,
  flatten_mix: boolean,
  partial_score: boolean,
  disable_timer: boolean
}

export interface PlaySettingsOptionsProps {
  play_settings_options: IPlaySettingsOptionsState,
  setPlaySettingsOptions: (state: IPlaySettingsOptionsState) => void
}
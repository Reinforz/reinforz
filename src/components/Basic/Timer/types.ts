export interface TimerProps {
  timeout: number,
  onTimerEnd: any,
  children: any,
}

export interface TimerState {
  timeout: number,
  timer: undefined | number
}

export interface TimerRenderProps {
  TimerComponent: JSX.Element,
  TimerState: TimerState,
}
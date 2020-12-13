export interface TimerProps {
  timeout: number,
  onTimerEnd: any,
  children: any,
}

export interface TimerState {
  timeout: number,
  timer: undefined | number
}

export interface TimerRProps {
  TimerComponent: JSX.Element,
  TimerState: TimerState,
}
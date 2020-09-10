import React from "react";

import { TimerProps, TimerState, TimerRProps } from "../../types";

import "./Timer.scss";

export default class Timer extends React.Component<TimerProps, TimerState> {
  state = {
    timeout: this.props.timeout,
    timer: undefined
  };

  componentWillUnmount = () => {
    this.clearInterval(true);
  };

  clearInterval = (shouldClearInterval = false) => {
    if (shouldClearInterval) clearInterval(this.state.timer);
    this.setState({
      timer: undefined,
      timeout: 0
    });
  };

  componentDidMount() {
    clearInterval(this.state.timer);
    const timer = setInterval(() => {
      if (this.state.timeout !== 0) {
        this.setState({
          timeout: this.state.timeout - 1
        });
      } else {
        this.props.onTimerEnd();
        clearInterval(timer);
      }
    }, 1000);
    this.setState({
      timeout: this.props.timeout,
      timer
    });
  }

  displayTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `0${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  render() {
    const { timeout } = this.state;
    return this.props.children({
      TimerComponent: <div className="Timer">{this.displayTime(timeout)}</div>,
      TimerState: this.state,
      TimerUtils: {
        clearInterval: this.clearInterval
      }
    } as TimerRProps);
  }
}
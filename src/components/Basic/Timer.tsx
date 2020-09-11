import React from "react";
import { Theme, withTheme } from '@material-ui/core/styles';

import { TimerProps, TimerState, TimerRProps, ExtendedTheme } from "../../types";

import "./Timer.scss";

class Timer extends React.Component<TimerProps & { theme: Theme }, TimerState> {
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
    const { theme } = this.props;
    return this.props.children({
      TimerComponent: <div style={{ backgroundColor: (theme as ExtendedTheme).color.dark, color: theme.palette.text.primary }} className="Timer">{this.displayTime(timeout)}</div>,
      TimerState: this.state,
      TimerUtils: {
        clearInterval: this.clearInterval
      }
    } as TimerRProps);
  }
}

export default withTheme(Timer)
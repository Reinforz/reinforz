import styled from "styled-components";
import React from "react";

import "./Timer.scss";

const TimerDisplay = styled.div`
	padding: 5px 20px;
	margin: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
`;

interface TimerProps {
  timeout: number,
  onTimerEnd: any,
  children: any
}

interface TimerState {
  timeout: number,
  timer: undefined | number
}

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
      timer: <TimerDisplay>{this.displayTime(timeout)}</TimerDisplay>,
      currentTime: timeout,
      clearInterval: this.clearInterval
    });
  }
}
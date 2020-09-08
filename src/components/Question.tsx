import styled from "styled-components";
import React, { useState, Fragment } from "react";

import Button from "@material-ui/core/Button"
import Timer from "./Timer";
import { TimerRProps, QuestionInputFull, HintsRProps } from "../types";
import Highlighter from "./Highlighter";
import Options from "./Options";
import Hints from "./Hints";

const QuestionContainer = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionContainerQuestion = styled.div`
  user-select: none;
  font-weight: bolder;
  font-size: 1.5rem;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface QuestionProps {
  question: QuestionInputFull,
  changeCounter: (user_answers: string[], time_taken: number, hints_used: number) => void,
  hasEnd: boolean,
};

export default function Question(props: QuestionProps) {
  const { hasEnd, question, question: { question: _question, type, image, format, time_allocated, hints } } = props;

  const generateQuestion = () => {
    if (format === "html") return <Highlighter language={"typescript"} code={_question} />
    else return <QuestionContainerQuestion className="Question-container-item Question-container-question">{_question}</QuestionContainerQuestion>
  }

  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(_question.match(/(\$\{_\})/g)?.length ?? 1).fill('') as string[] : ['']);
  return <QuestionContainer className="Question-container">
    {image && <div className="Question-container-item Question-container-image"><img src={image} alt="question" /></div>}
    {generateQuestion()}
    <Options changeOption={changeUserAnswers} user_answers={user_answers} question={question} />
    <Hints hints={hints}>
      {({ HintsButton, HintsList, hints_state }: HintsRProps) => {
        return <Fragment>
          <Timer timeout={time_allocated} onTimerEnd={() => {
            props.changeCounter(user_answers.filter(user_answer => user_answer !== ""), time_allocated, hints_state.hints_used)
          }}>
            {(timerprops: TimerRProps) => {
              return <Fragment>
                {timerprops.timer}
                <Button className="Quiz-container-button" variant="contained" color="primary" onClick={() => {
                  props.changeCounter(user_answers.filter(user_answer => user_answer !== ""), time_allocated - timerprops.currentTime, hints_state.hints_used)
                }}>{!hasEnd ? "Next" : "Report"}</Button>
              </Fragment>
            }}
          </Timer>
          {HintsButton}
          {HintsList}
        </Fragment>
      }}
    </Hints>

  </QuestionContainer>
}

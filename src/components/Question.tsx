import React, { useState, Fragment } from "react";
import { Button, TextField } from "@material-ui/core";

import "./Question.scss";

import Timer from "./Timer";
import Highlighter from "./Highlighter";
import Options from "./Options";
import Hints from "./Hints";
import { OptionsContainerItem } from "./Options";
import { TimerRProps, QuestionInputFull, HintsRProps } from "../types";

interface QuestionProps {
  question: QuestionInputFull,
  changeCounter: (user_answers: string[], time_taken: number, hints_used: number) => void,
  hasEnd: boolean,
};

export default function Question(props: QuestionProps) {
  const { hasEnd, question: { question, index, _id, type, image, format, time_allocated, hints } } = props;
  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(question.match(/(%_%)/g)?.length ?? 1).fill('') as string[] : ['']);

  const generateQuestion = () => {
    if (format === "html") return <Highlighter language={"typescript"} code={question} />
    else {
      if (type !== "FIB") return <div className="Question-container-item Question-container-question">{question}</div>;
      else {
        let message = question, last_index = 0, messages: string[] = [], total_fib = 0;
        while ((last_index = message.indexOf("%_%")) !== -1) {
          messages.push(message.substr(0, last_index));
          message = message.substr(last_index + 4);
          total_fib++;
        };
        return <OptionsContainerItem>
          {messages.map((message, i) => {
            return <Fragment key={`${_id}option${index}${i}`}>
              <div className="Question-container-question--FIB">{message}</div>
              <div className="Question-container-option-FIB">
                <TextField value={user_answers[i]} onChange={e => {
                  user_answers[i] = e.target.value;
                  changeUserAnswers([...user_answers])
                }} />
              </div>
            </Fragment>
          })}
          {messages.length > total_fib ? messages[messages.length - 1] : null}
        </OptionsContainerItem>
      }
    }
  }

  return <div className="Question-container">
    {image && <div className="Question-container-item Question-container-image"><img src={image} alt="question" /></div>}
    {generateQuestion()}
    {type !== "FIB" && <Options changeOption={changeUserAnswers} user_answers={user_answers} question={props.question} />}
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
  </div>
}

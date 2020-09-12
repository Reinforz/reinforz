import React, { useState, Fragment, useRef, createRef, RefObject } from "react";
import { Button, TextField } from "@material-ui/core";

import Timer from "../Basic/Timer";
import QuestionHighlighter from "./QuestionHighlighter/QuestionHighlighter";
import QuestionOptions from "./QuestionOptions/QuestionOptions";
import QuestionHints from "./QuestionHints/QuestionHints";

import { TimerRProps, QuestionProps, QuestionHintsRProps } from "../../types";

import "./Question.scss";

export default function Question(props: QuestionProps) {
  const { hasEnd, question: { question, index, _id, type, image, format, time_allocated, hints } } = props;
  const total_fibs = question.match(/(%_%)/g)?.length;
  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(total_fibs ?? 1).fill('') as string[] : ['']);
  const fibRefs = useRef(Array(total_fibs).fill(0).map(() => createRef() as RefObject<HTMLInputElement>));

  const generateQuestion = () => {
    if (format === "code") return <QuestionHighlighter format={format} fibRefs={fibRefs} type={type} language={"typescript"} code={question} />
    else {
      if (type !== "FIB") return <div className="Question-container-item Question-container-question">{question}</div>;
      else {
        let message = question, last_index = 0, messages: string[] = [], total_fib = 0;
        while ((last_index = message.indexOf("%_%")) !== -1) {
          messages.push(message.substr(0, last_index));
          message = message.substr(last_index + 4);
          total_fib++;
        };
        return <div className="QuestionOptions-container-item">
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
        </div>
      }
    }
  }

  return <div className="Question-container">
    {image && <div className="Question-container-item Question-container-image"><img src={image} alt="question" /></div>}
    {generateQuestion()}
    {type !== "FIB" && <QuestionOptions changeOption={changeUserAnswers} user_answers={user_answers} question={props.question} />}
    <QuestionHints hints={hints}>
      {({ QuestionHintsComponent, QuestionHintsState }: QuestionHintsRProps) => {
        return <Fragment>
          <Timer timeout={time_allocated} onTimerEnd={() => {
            props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated, QuestionHintsState.hints_used)
          }}>
            {({ TimerComponent, TimerState }: TimerRProps) => {
              return <Fragment>
                {TimerComponent}
                <Button className="Quiz-container-button" variant="contained" color="primary" onClick={() => {
                  props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated - TimerState.timeout, QuestionHintsState.hints_used)
                }}>{!hasEnd ? "Next" : "Report"}</Button>
              </Fragment>
            }}
          </Timer>
          {QuestionHintsComponent}
        </Fragment>
      }}
    </QuestionHints>
  </div>
}

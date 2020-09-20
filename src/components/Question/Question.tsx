import React, { useState, Fragment, useRef, createRef, RefObject, useContext } from "react";
import { Button, useTheme } from "@material-ui/core";

import Timer from "../Basic/Timer";
import QuestionHighlighter from "./QuestionHighlighter/QuestionHighlighter";
import QuestionOptions from "./QuestionOptions/QuestionOptions";
import QuestionHints from "./QuestionHints/QuestionHints";

import SettingsContext from "../../context/SettingsContext";

import { TimerRProps, QuestionProps, QuestionHintsRProps, ExtendedTheme, ISettings } from "../../types";

import "./Question.scss";

const click = new Audio(process.env.PUBLIC_URL + "/sounds/click.mp3");
click.volume = 0.15;

export default function Question(props: QuestionProps) {
  const { hasEnd, index, question: { question, _id, type, image, format, time_allocated, hints, answers, language } } = props;
  const total_fibs = question.match(/(%_%)/g)?.length;
  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(total_fibs ?? 1).fill('') as string[] : ['']);
  const fibRefs = useRef(Array(total_fibs).fill(0).map(() => createRef() as RefObject<HTMLInputElement>));
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;

  const generateQuestion = () => {
    if (format === "code") return <QuestionHighlighter image={image} answers={answers} fibRefs={fibRefs} type={type} language={language} code={question} />
    else {
      if (type !== "FIB") return <div className="Question-question" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark, width: image ? "50%" : "100%" }}>{question}</div>;
      else {
        const messages: string[] = question.split("%_%");
        return <div className="Question-question" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
          {messages.map((message, i) => {
            return <Fragment key={`${_id}option${index}${i}`}>
              <div className="Question-question--FIB">{message}</div>
              {i !== messages.length - 1 && <input style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }} spellCheck={false} className="Highlighter-FIB-Code" ref={fibRefs.current[i]} />}
            </Fragment>
          })}
        </div>
      }
    }
  }

  const QuestionOption = type !== "FIB" && <QuestionOptions changeOption={changeUserAnswers} user_answers={user_answers} question={props.question} />;
  return <div className="Question">
    <div className="Question-container" style={{ display: image ? "flex" : "block" }}>
      {image && <div className="Question-image" style={{ width: "50%" }}><img src={image} alt="question" /></div>}
      {generateQuestion()}
    </div>

    <QuestionHints hints={hints}>
      {({ QuestionHintsComponent, QuestionHintsState }: QuestionHintsRProps) => {
        return <Fragment>
          {QuestionOption}
          {QuestionHintsComponent}
          <Timer timeout={time_allocated} onTimerEnd={() => {
            props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated, QuestionHintsState.hints_used)
          }}>
            {({ TimerComponent, TimerState }: TimerRProps) => {
              return <div style={{ display: "flex", gridArea: "3/2/4/3", justifyContent: "center" }}>
                {TimerComponent}
                <Button className="Quiz-button" variant="contained" color="primary" onClick={() => {
                  if (settings.sound) click.play();
                  props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated - TimerState.timeout, QuestionHintsState.hints_used)
                }}>{!hasEnd ? "Next" : "Report"}</Button>
              </div>
            }}
          </Timer>
        </Fragment>
      }}
    </QuestionHints>
  </div>
}

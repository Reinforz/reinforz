import React, { useState, Fragment, useRef, createRef, RefObject } from "react";
import { Button, } from "@material-ui/core";
import marked from "marked";
import createDOMPurify from 'dompurify';

import Timer from "../Basic/Timer";
import QuestionHighlighter from "./QuestionHighlighter/QuestionHighlighter";
import QuestionOptions from "./QuestionOptions/QuestionOptions";
import QuestionHints from "./QuestionHints/QuestionHints";

import useThemeSettings from "../../hooks/useThemeSettings";

import { TimerRProps, QuestionProps, QuestionHintsRProps } from "../../types";

import "./Question.scss";
import { HotKeys } from "react-hotkeys";

const DOMPurify = createDOMPurify(window);
const click = new Audio(process.env.PUBLIC_URL + "/sounds/click.mp3");
click.volume = 0.15;

export default function Question(props: QuestionProps) {
  const { hasEnd, index, question: { question, options, _id, type, image, format, time_allocated, hints, answers, language } } = props;
  const total_fibs = question.match(/(%_%)/g)?.length;
  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(total_fibs ?? 1).fill('') as string[] : ['']);
  const fibRefs = useRef(Array(total_fibs).fill(0).map(() => createRef() as RefObject<HTMLInputElement>));
  const { theme, settings } = useThemeSettings();

  const generateQuestion = () => {
    if (format === "code") return <QuestionHighlighter image={image} answers={answers} fibRefs={fibRefs} type={type} language={language} code={question} />
    else {
      if (type !== "FIB") return <div className="Question-question" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark, width: image ? "50%" : "100%" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(question.toString())) }} />;
      else {
        const messages: string[] = question.split("%_%");
        return <div className="Question-question" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
          {messages.map((message, i) => {
            return <Fragment key={`${_id}option${index}${i}`}>
              <span className="Question-question--FIB" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(message.toString())) }} />
              {i !== messages.length - 1 && <input style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }} spellCheck={false} className="Highlighter-FIB-Code" ref={fibRefs.current[i]} />}
            </Fragment>
          })}
        </div>
      }
    }
  }
  let timer_state: any = {}, question_hints_state: any = {};

  const onButtonClick = () => {
    if (settings.sound) click.play();
    props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated - timer_state.timeout, question_hints_state.hints_used)
  }

  const keyMap: any = {
    next_question: "enter"
  };

  const handlers: any = {
    next_question: onButtonClick
  };
  if (type === "MCQ") {
    options && options.forEach((_, i) => {
      keyMap[i + 1] = `${i + 1}`;
      handlers[i + 1] = (e: any) => {
        e.persist();
        const pressed_option = e.keyCode - 49;
        const isChecked = user_answers.includes(pressed_option.toString());
        if (!isChecked)
          changeUserAnswers([pressed_option.toString()])
      }
    });
  } else if (type === "MS") {
    options && options.forEach((_, i) => {
      keyMap[i + 1] = `${i + 1}`;
      handlers[i + 1] = (e: any) => {
        e.persist();
        const pressed_option = e.keyCode - 49;
        const isChecked = user_answers.includes(pressed_option.toString());
        if (!isChecked)
          changeUserAnswers([...user_answers, pressed_option.toString()])
        else
          changeUserAnswers(user_answers.filter(user_answer => user_answer !== pressed_option.toString()));
      }
    });
  }

  const QuestionOption = type !== "FIB" && <QuestionOptions changeOption={changeUserAnswers} user_answers={user_answers} question={props.question} />;
  return <HotKeys className="Question" keyMap={keyMap} handlers={handlers} allowChanges={true} style={{ outline: "none" }} >
    <div className="Question-container" style={{ display: image ? "flex" : "block" }}>
      {image && <div className="Question-image" style={{ width: "50%" }}><img src={image} alt="question" /></div>}
      {generateQuestion()}
    </div>

    <QuestionHints hints={hints}>
      {({ QuestionHintsComponent, QuestionHintsState }: QuestionHintsRProps) => {
        question_hints_state = QuestionHintsState;
        return <Fragment>
          {QuestionOption}
          {QuestionHintsComponent}
          <Timer timeout={time_allocated} onTimerEnd={() => {
            props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated, QuestionHintsState.hints_used)
          }}>
            {({ TimerComponent, TimerState }: TimerRProps) => {
              timer_state = TimerState;
              return <div style={{ display: "flex", gridArea: "3/2/4/3", justifyContent: "center" }}>
                {TimerComponent}
                <Button className="Quiz-button" variant="contained" color="primary" onClick={onButtonClick}>{!hasEnd ? "Next" : "Report"}</Button>
              </div>
            }}
          </Timer>
        </Fragment>
      }}
    </QuestionHints>
  </HotKeys>
}

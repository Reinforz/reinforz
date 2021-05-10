import { Button } from "@material-ui/core";
import createDOMPurify from 'dompurify';
import marked from "marked";
import React, { createRef, Fragment, RefObject, useEffect, useRef, useState } from "react";
import { HotKeys } from "react-hotkeys";
import { useThemeSettings } from "../../hooks";
import { Timer } from "../../shared";
import { QuestionHintsRProps, QuestionProps, TimerRProps } from "../../types";
import "./Question.scss";
import QuestionHighlighter from "./QuestionHighlighter/QuestionHighlighter";
import QuestionHints from "./QuestionHints/QuestionHints";
import QuestionOptions from "./QuestionOptions/QuestionOptions";

const DOMPurify = createDOMPurify(window);

export default function Question(props: QuestionProps) {
  const { hasEnd, index, question: { question, options, _id, type, image, format, time_allocated, hints, answers, language } } = props;
  const total_fibs = question.match(/(%_%)/g)?.length;
  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(total_fibs ?? 1).fill('') as string[] : ['']);
  const fibRefs = useRef(Array(total_fibs).fill(0).map(() => createRef() as RefObject<HTMLInputElement>));
  const { theme, settings, sounds } = useThemeSettings();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) (ref.current as any).focus();
  }, [])

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

  const QuestionOption = type !== "FIB" && <QuestionOptions changeOption={changeUserAnswers} user_answers={user_answers} question={props.question} />;
  const GeneratedQuestion = generateQuestion();
  return <QuestionHints hints={hints}>
    {({ QuestionHintsComponent, QuestionHintsState, QuestionHintsUtils }: QuestionHintsRProps) => {
      const onButtonClick = (time_taken: number) => {
        if (settings.sound) sounds.click.play();
        props.changeCounter(type !== "FIB" ? user_answers.filter(user_answer => user_answer !== "") : fibRefs.current.map(fibRef => fibRef?.current?.value ?? ""), time_allocated - time_taken, QuestionHintsState.hints_used)
      }
      return <Timer timeout={time_allocated} onTimerEnd={() => {
        onButtonClick(time_allocated)
      }}>
        {({ TimerComponent, TimerState }: TimerRProps) => {
          const keyMap: any = {
            next_question: "right",
            next_hint: "down"
          };

          const handlers: any = {
            next_question: () => {
              onButtonClick(TimerState.timeout)
            },
            next_hint: () => {
              QuestionHintsUtils.getNextIndex()
            }
          };

          if (type.match(/(MCQ|MS)/)) {
            options && options.forEach((_, i) => {
              keyMap[i + 1] = `${i + 1}`;
              handlers[i + 1] = (e: any) => {
                e.persist();
                const pressed_option = e.keyCode - 49;
                const isChecked = user_answers.includes(pressed_option.toString());
                if (type === "MS") {
                  if (!isChecked)
                    changeUserAnswers([...user_answers, pressed_option.toString()])
                  else
                    changeUserAnswers(user_answers.filter(user_answer => user_answer !== pressed_option.toString()));
                } else if (type === "MCQ") {
                  if (!isChecked)
                    changeUserAnswers([pressed_option.toString()])
                }
              }
            })
          }

          return <HotKeys innerRef={ref} className="Question" keyMap={keyMap} handlers={handlers} allowChanges={true} style={{ outline: "none" }} >
            <div className="Question-container" style={{ display: image ? "flex" : "block" }}>
              {image && <div className="Question-image" style={{ width: "50%" }}><img src={image} alt="question" /></div>}
              {GeneratedQuestion}
            </div>
            {QuestionOption}
            {QuestionHintsComponent}
            <div style={{ display: "flex", gridArea: "3/2/4/3", justifyContent: "center" }}>
              {TimerComponent}
              <Button className="Quiz-button" variant="contained" color="primary" onClick={() => { onButtonClick(TimerState.timeout) }}>{!hasEnd ? "Next" : "Report"}</Button>
            </div>
          </HotKeys>
        }}
      </Timer>
    }}
  </QuestionHints>
}

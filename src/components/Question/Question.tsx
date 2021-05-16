import createDOMPurify from 'dompurify';
import React, { useState } from "react";
import { useThemeSettings } from "../../hooks";
import { QuestionInputFull } from "../../types";
import { FIBQuestion } from "./FIBQuestion";
import { MCQQuestion } from "./MCQQuestion";
import { MSQuestion } from "./MSQuestion";
import "./Question.scss";
import { SnippetQuestion } from "./SnippetQuestion";

const DOMPurify = createDOMPurify(window);

interface Props {
  question: QuestionInputFull,
  changeCounter: (userAnswers: string[], time_taken: number, hints_used: number) => void,
  isLast: boolean,
};

export default function Question(props: Props) {
  const { isLast, question: { question, options, _id, type, image, format, time_allocated, hints, answers, language } } = props;
  const [userAnswers, changeUserAnswers] = useState<string[]>([]);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const { theme } = useThemeSettings();

  // const generateQuestion = () => {
  //   if (format === "code") return <QuestionHighlighter image={image} answers={answers} fibRefs={fibRefs} type={type} language={language} code={question} />
  //   else {
  //     if (type !== "FIB") return <div className="Question-question" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark, width: image ? "50%" : "100%" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(question.toString())) }} />;
  //     else {
  //       const messages: string[] = question.split("%_%");
  //       return <div className="Question-question" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
  //         {messages.map((message, i) => {
  //           return <Fragment key={`${_id}option${i}`}>
  //             <span className="Question-question--FIB" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(message.toString())) }} />
  //             {i !== messages.length - 1 && <input style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }} spellCheck={false} className="Highlighter-FIB-Code" />}
  //           </Fragment>
  //         })}
  //       </div>
  //     }
  //   }
  // }

  // const QuestionOption = type !== "FIB" && <QuestionOptions changeOption={changeUserAnswers} user_answers={user_answers} question={props.question} />;
  // const GeneratedQuestion = generateQuestion();

  switch (type) {
    case "FIB": {
      return <FIBQuestion />
    }
    case "MCQ": {
      return <MCQQuestion usedHints={usedHints} setUsedHints={setUsedHints} question={props.question} userAnswers={userAnswers} changeUserAnswers={changeUserAnswers} />
    }
    case "MS": {
      return <MSQuestion />
    }
    case "Snippet": {
      return <SnippetQuestion />
    }
  }

  /* return <QuestionHints hints={hints}>
    {({ QuestionHintsComponent, QuestionHintsState, QuestionHintsUtils }: QuestionHintsRProps) => {
      const onButtonClick = (time_taken: number) => {
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

          return <div className="Question" style={{ outline: "none" }} >
            <div className="Question-container" style={{ display: image ? "flex" : "block" }}>
              {image && <div className="Question-image" style={{ width: "50%" }}><img src={image} alt="question" /></div>}
              {GeneratedQuestion}
            </div>
            {QuestionOption}
            {QuestionHintsComponent}
            <div style={{ display: "flex", gridArea: "3/2/4/3", justifyContent: "center" }}>
              {TimerComponent}
              <Button className="Quiz-button" variant="contained" color="primary" onClick={() => { onButtonClick(TimerState.timeout) }}>{!isLast ? "Next" : "Report"}</Button>
            </div>
          </div>
        }}
      </Timer>
    }}
  </QuestionHints> */
}

import React, { useState } from "react";
import { useTimer } from '../../hooks';
import { QuestionInputFull } from "../../types";
import { FIBQuestion } from "./FIBQuestion";
import { MCQQuestion } from "./MCQQuestion";
import { MSQuestion } from "./MSQuestion";
import "./Question.scss";
import { SnippetQuestion } from "./SnippetQuestion";

interface Props {
  question: QuestionInputFull,
  changeCounter: (userAnswers: string[], time_taken: number, hints_used: number) => void,
  isLast: boolean,
};

export default function Question(props: Props) {
  const { changeCounter, isLast, question: { type, time_allocated } } = props;
  const [userAnswers, changeUserAnswers] = useState<string[]>([]);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const { timeout } = useTimer(time_allocated, changeCounter);

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

  switch (type) {
    case "FIB": {
      return <FIBQuestion />
    }
    case "MCQ": {
      return <MCQQuestion currentTime={timeout} changeCounter={changeCounter} isLast={isLast} usedHints={usedHints} setUsedHints={setUsedHints} question={props.question} userAnswers={userAnswers} changeUserAnswers={changeUserAnswers} />
    }
    case "MS": {
      return <MSQuestion />
    }
    case "Snippet": {
      return <SnippetQuestion />
    }
  }

  /* return <Timer timeout={time_allocated} onTimerEnd={() => {
        onButtonClick(time_allocated)
      }}>
        {({ TimerComponent, TimerState }: TimerRProps) => {
          if (type.match(/(MCQ|MS)/)) {
            options && options.forEach((_, i) => {
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
            })
          }
        }}
      </Timer>
    }}*/
}

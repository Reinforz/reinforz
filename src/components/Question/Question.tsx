import React, { useEffect, useState } from "react";
import { TQuestionInputFull } from "../../types";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { InputQuestion } from "./InputQuestion";
import "./Question.scss";

interface Props {
  question: TQuestionInputFull,
  changeCounter: (userAnswers: string[], time_taken: number, hints_used: number) => void,
  isLast: boolean,
};

export default function Question(props: Props) {
  const { changeCounter, isLast, question: { type, time_allocated } } = props;
  const [userAnswers, changeUserAnswers] = useState<string[]>([]);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [timeout, setTimeout] = useState(time_allocated);

  const onNextButtonPress = () => {
    setTimeout(props.question.time_allocated)
    changeCounter(userAnswers, time_allocated - timeout, usedHints.length)
    changeUserAnswers([])
    setUsedHints([])
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeout !== 0)
        setTimeout((seconds) => {
          return seconds - 1
        })
      else {
        clearInterval(timer);
        onNextButtonPress()
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.question])

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
    case "FIB":
    case "Snippet": {
      return <InputQuestion />
    }
    case "MCQ":
    case "MS": {
      return <ChoiceQuestion currentTime={timeout} changeCounter={onNextButtonPress} isLast={isLast} usedHints={usedHints} setUsedHints={setUsedHints} question={props.question} userAnswers={userAnswers} changeUserAnswers={changeUserAnswers} />
    }
  }
}

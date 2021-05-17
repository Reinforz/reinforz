import { Button, useTheme } from "@material-ui/core";
import DOMPurify from "dompurify";
import marked from "marked";
import React, { useEffect, useState } from "react";
import { ExtendedTheme, TQuestionInputFull } from "../../types";
import { displayTime } from "../../utils";
import "./Question.scss";
import QuestionHints from "./QuestionHints/QuestionHints";
import QuestionInputs from "./QuestionInputs/QuestionInputs";
import QuestionOptions from "./QuestionOptions/QuestionOptions";

interface Props {
  question: TQuestionInputFull,
  changeCounter: (userAnswers: string[], time_taken: number, hints_used: number) => void,
  isLast: boolean,
};

export default function Question(props: Props) {
  const { changeCounter, isLast, question: { type, image, hints, question, time_allocated } } = props;
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [timeout, setTimeout] = useState<null | number>(null);
  const [timer, setTimer] = useState<null | number>(null);
  const theme = useTheme() as ExtendedTheme;

  const onNextButtonPress = () => {
    setUserAnswers([])
    setUsedHints([])
    setTimer(null)
    setTimeout(null)
    typeof timer === "number" && clearInterval(timer)
    changeCounter(userAnswers, time_allocated - (timeout as number), usedHints.length)
  }

  if (timeout === 0) {
    onNextButtonPress()
  }

  useEffect(() => {
    setTimeout(props.question.time_allocated)
    const timer = setInterval(() => {
      setTimeout((seconds) => {
        return typeof seconds === "number" ? seconds - 1 : 0
      })
    }, 1000);
    setTimer(timer)
  }, [props.question])


  return <div className="Question">
    <div className="Question-question" style={{ gridArea: image ? `1/1/2/2` : `1/1/2/3` }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(question.toString())) }}></div>
    {image && <div className="Question-image" style={{ gridArea: `1/2/2/3` }}><img src={image} alt="Question" /></div>}
    {type.match(/(MCQ|MS)/) ? <QuestionOptions setUserAnswers={setUserAnswers} userAnswers={userAnswers} question={props.question} /> : <QuestionInputs setUserAnswers={setUserAnswers} userAnswers={userAnswers} question={props.question} />}
    <QuestionHints usedHints={usedHints} setUsedHints={setUsedHints} hints={hints} />
    {timeout && <div style={{ display: 'flex', gridArea: `3/2/4/3`, alignItems: `center`, height: '65px' }}>
      <Button className="QuestionButton" variant="contained" color="primary" onClick={onNextButtonPress}>{!isLast ? "Next" : "Report"}</Button>
      <div style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} className="QuestionTimer">{displayTime(timeout)}</div>
    </div>}
  </div>
}

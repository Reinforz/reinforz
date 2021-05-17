import { Button, useTheme } from "@material-ui/core";
import createDOMPurify from 'dompurify';
import marked from "marked";
import React from "react";
import { ExtendedTheme, TQuestionInputFull } from "../../types";
import { displayTime } from "../../utils";
import QuestionHints from "./QuestionHints/QuestionHints";
import QuestionOptions from "./QuestionOptions/QuestionOptions";

const DOMPurify = createDOMPurify(window);

interface Props {
  question: TQuestionInputFull
  userAnswers: string[]
  changeUserAnswers: React.Dispatch<React.SetStateAction<string[]>>
  usedHints: string[]
  setUsedHints: React.Dispatch<React.SetStateAction<string[]>>
  changeCounter: () => void
  isLast: boolean
  currentTime: number
}

export const ChoiceQuestion = (props: Props) => {
  const { currentTime, isLast, changeCounter, usedHints, setUsedHints, userAnswers, changeUserAnswers, question: { question, image, hints } } = props;
  const theme = useTheme() as ExtendedTheme;

  return <div className="Question">
    <div className="Question-question" style={{ gridArea: image ? `1/1/2/2` : `1/1/2/3` }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(question.toString())) }}></div>
    {image && <div className="Question-image" style={{ gridArea: `1/2/2/3` }}><img src={image} alt="Question" /></div>}
    <QuestionOptions changeOption={changeUserAnswers} user_answers={userAnswers} question={props.question} />
    <QuestionHints usedHints={usedHints} setUsedHints={setUsedHints} hints={hints} />
    <div style={{ display: 'flex', gridArea: `3/2/4/3`, alignItems: `center`, height: '65px' }}>
      <Button className="QuestionButton" variant="contained" color="primary" onClick={changeCounter}>{!isLast ? "Next" : "Report"}</Button>
      <div style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} className="QuestionTimer">{displayTime(currentTime)}</div>
    </div>
  </div>
}
import React from "react";
import { QuestionInputFull } from "../../types";
import QuestionHints from "./QuestionHints/QuestionHints";
import QuestionOptions from "./QuestionOptions/QuestionOptions";

interface Props {
  question: QuestionInputFull
  userAnswers: string[]
  changeUserAnswers: React.Dispatch<React.SetStateAction<string[]>>
  usedHints: string[]
  setUsedHints: React.Dispatch<React.SetStateAction<string[]>>
}

export const MCQQuestion = (props: Props) => {
  const { usedHints, setUsedHints, userAnswers, changeUserAnswers, question: { question, options, _id, type, image, format, time_allocated, hints, answers, language } } = props;

  return <div className="Question">
    <div className="Question-question" style={{ gridArea: image ? `1/1/2/2` : `1/1/2/3` }}>{question}</div>
    {image && <div className="Question-image"><img src={image} alt="Question" /></div>}
    <QuestionOptions changeOption={changeUserAnswers} user_answers={userAnswers} question={props.question} />
    <QuestionHints usedHints={usedHints} setUsedHints={setUsedHints} hints={hints} />
    <div className="QuestionHints"></div>
  </div>
}
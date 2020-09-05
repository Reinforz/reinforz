import React from "react";

import { QuizInputPartial } from "../types";
import Question from "./Question";

export default function Quiz(props: QuizInputPartial): JSX.Element{
  return <div className="Quiz-container">
    {props.questions.map((question,index)=>{
      question.key = index + question.question.toLowerCase().replace(/\s/g,'');
      return <Question key={question.key} {...question}/>
    })}
  </div>
}
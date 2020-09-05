import React,{useState} from "react";

import { QuizInputPartial } from "../types";
import Question from "./Question";

export default function Quiz(props: QuizInputPartial): JSX.Element{
  const [current_question,changeQuestion] = useState(0);
  const question = props.questions[current_question];
  const key = current_question + question.question.toLowerCase().replace(/\s/g,'');
  const total_questions = props.questions.length;
  const exhausted_questions = current_question >= total_questions - 1;
  return <div className="Quiz-container">
    <Question key={key} {...question} total={total_questions} index={current_question+1}/>
    <button onClick={()=>!exhausted_questions && changeQuestion(current_question+1)}>{!exhausted_questions ? "Next" : "Report"}</button>
  </div>
}
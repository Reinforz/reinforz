import React from "react";

import { QuestionInputPartial, QuestionInputKeys } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";

export default function Question(props: QuestionInputPartial): JSX.Element{
  const generated_question_inputs = generateQuestionInputConfigs(props);

  const {question,
    image,
    answers,
    options,
    correct_answer_message,
    incorrect_answer_message,
    explanation} = generated_question_inputs;

  return <div className="Question-container">
    <div className="Question-container-stats">
  {(["type","format","weight","add_to_score","time_allocated","difficulty"] as QuestionInputKeys).map(stat=><div key={`question-${stat}`} className={`Question-container-stats-${stat}`}>{generated_question_inputs[stat]}</div>)}
    </div>
    <div className="Question-container-question">{question}</div>
  </div>
}
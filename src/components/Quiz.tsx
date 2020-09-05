import React, { useState } from "react";

import { QuizInputPartial, QuestionInputFull } from "../types";
import Question from "./Question";
import Report from "./Report";
import {Result} from "../types";

export default function Quiz (props:QuizInputPartial){
  const results: Result[] = [];
  const [current_question,setCurrentQuestion] = useState(0);
  const question = props.questions[current_question];
  const key = current_question + question.question.toLowerCase().replace(/\s/g, '');
  const total_questions = props.questions.length;
  const validateAnswer = (generated_question: QuestionInputFull, user_answers: string[])=>{
    if(generated_question.type === "MCQ"){
      const verdict = generated_question.answers[0].toString() === user_answers[0].toString() 
      results.push({
        user_answers,
        verdict,
        add_to_score: generated_question.add_to_score,
        score: generated_question.weight * (verdict ? 1 : 0)
      })
    }
  }

  return <div className="Quiz-container">
    {current_question !== total_questions ? <Question key={key} {...question} total={total_questions} index={current_question + 1} changeCounter={(generated_question: QuestionInputFull, user_answers: string[])=>{
      validateAnswer(generated_question, user_answers)
      setCurrentQuestion(current_question+1)
    }}/> : <Report results={results}/>}
  </div>
}
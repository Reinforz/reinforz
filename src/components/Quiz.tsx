import React, { useState } from "react";

import { QuizInputPartial, QuestionInputFull } from "../types";
import Question from "./Question";
import Report from "./Report";
import { Result } from "../types";
import decideVerdict from "../utils/decideVerdict";

export default function Quiz(props: QuizInputPartial) {
  const [current_question, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([] as Result[]);
  const total_questions = props.questions.length;

  const validateAnswer = ({ weight, type, question, format, time_allocated, answers, add_to_score, explanation }: QuestionInputFull, user_answers: (number | string)[], time_taken: number) => {
    user_answers = user_answers.filter(user_answer => user_answer !== "");
    let verdict = decideVerdict(type, answers, user_answers);
    setResults([...results, {
      user_answers,
      answers,
      verdict,
      add_to_score,
      score: weight * (verdict ? 1 : 0),
      question: format !== "html" ? question : "Code",
      type,
      time_allocated,
      time_taken,
      explanation
    }])
  }

  const generateContent = () => {
    if (current_question !== total_questions) {
      const question = props.questions[current_question];
      return <Question key={question._id} {...question} total={total_questions} index={current_question + 1} changeCounter={(generated_question: QuestionInputFull, user_answers: string[], time_taken: number) => {
        validateAnswer(generated_question, user_answers, time_taken)
        setCurrentQuestion(current_question + 1)
      }} />
    }
    else return <Report results={results} />
  }

  return <div className="Quiz-container">
    {generateContent()}
  </div>
}
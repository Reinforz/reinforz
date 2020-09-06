import React, { useState } from "react";

import { QuizInputPartial, QuestionInputFull } from "../types";
import Question from "./Question";
import Report from "./Report";
import { Result } from "../types";

export default function Quiz(props: QuizInputPartial) {
  const [current_question, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([] as Result[]);
  const total_questions = props.questions.length;

  const validateAnswer = ({weight,type,question,time_allocated,answers,add_to_score,explanation}: QuestionInputFull, user_answers: (number | string)[],time_taken: number) => {
    console.log(explanation)
    user_answers = user_answers.filter(user_answer=>user_answer!=="");
    let verdict = null;
    switch (type) {
      case "MCQ":
      case "Snippet":
        verdict = answers.length === user_answers.length && answers[0].toString() === user_answers[0].toString();
        break;
      case "MS":
        user_answers = user_answers.map(user_answer => parseInt(user_answer as string)).sort();
        answers = answers.map(answer => parseInt(answer as string)).sort();
        verdict = user_answers.length === answers.length && user_answers.every((user_answer, i) => user_answer === answers[i]);
        break;
      case "FIB":
        verdict = user_answers.length === answers.length && user_answers.every((user_answer, i) => user_answer === answers[i]);
        break;
      }
      setResults([...results, {
        user_answers,
        answers,
        verdict,
        add_to_score,
        score: weight * (verdict ? 1 : 0),
        question,
        type,
        time_allocated,
        time_taken,
        explanation
      }])
  }

  const generateContent = () => {
    if (current_question !== total_questions) {
      const question = props.questions[current_question];
      const key = current_question + question.question.toLowerCase().replace(/\s/g, '');
      return <Question key={key} {...question} total={total_questions} index={current_question + 1} changeCounter={(generated_question: QuestionInputFull, user_answers: string[],time_taken: number) => {
        validateAnswer(generated_question, user_answers,time_taken)
        setCurrentQuestion(current_question + 1)
      }} />
    }
    else return <Report results={results} />
  }

  return <div className="Quiz-container">
    {generateContent()}
  </div>
}
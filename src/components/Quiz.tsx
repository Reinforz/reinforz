import React, { useState } from "react";

import { QuizInputPartial, QuestionInputFull } from "../types";
import Question from "./Question";
import Report from "./Report";
import { Result } from "../types";

export default function Quiz(props: QuizInputPartial) {
  const [current_question, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([] as Result[]);
  const total_questions = props.questions.length;

  const validateAnswer = (generated_question: QuestionInputFull, user_answers: (number | string)[]) => {
    user_answers = user_answers.filter(user_answer=>user_answer!=="");
    let verdict = null;
    switch (generated_question.type) {
      case "MCQ":
      case "Snippet":
        verdict = generated_question.answers.length === user_answers.length && generated_question.answers[0].toString() === user_answers[0].toString();
        break;
      case "MS":
        user_answers = user_answers.map(user_answer => parseInt(user_answer as string)).sort();
        generated_question.answers = generated_question.answers.map(answer => parseInt(answer as string)).sort();
        verdict = user_answers.length === generated_question.answers.length && user_answers.every((user_answer, i) => user_answer === generated_question.answers[i]);
        break;
      case "FIB":
        verdict = user_answers.length === generated_question.answers.length && user_answers.every((user_answer, i) => user_answer === generated_question.answers[i]);
        break;
      }
      setResults([...results, {
        user_answers,
        answers: generated_question.answers,
        verdict,
        add_to_score: generated_question.add_to_score,
        score: generated_question.weight * (verdict ? 1 : 0)
      }])
  }

  const generateContent = () => {
    if (current_question !== total_questions) {
      const question = props.questions[current_question];
      const key = current_question + question.question.toLowerCase().replace(/\s/g, '');
      return <Question key={key} {...question} total={total_questions} index={current_question + 1} changeCounter={(generated_question: QuestionInputFull, user_answers: string[]) => {
        validateAnswer(generated_question, user_answers)
        setCurrentQuestion(current_question + 1)
      }} />
    }
    else return <Report results={results} />
  }

  return <div className="Quiz-container">
    {generateContent()}
  </div>
}
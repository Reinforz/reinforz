import React, { useState, Fragment } from "react";
import md5 from "md5";

import { Result, QuestionInputPartial, IPlayOptions } from "../types";
import Question from "./Question";
import Report from "./Report";
import Stats from "./Stats";
import decideVerdict from "../utils/decideVerdict";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";
import shuffle from "../utils/arrayShuffler";

interface QuizProps {
  all_questions: QuestionInputPartial[],
  play_options: IPlayOptions
}

export default function Quiz(props: QuizProps) {
  const [current_question, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([] as Result[]);
  const { all_questions, play_options } = props;
  const total_questions = all_questions.length;

  const generateContent = () => {
    if (current_question !== total_questions) {
      const generated_question = generateQuestionInputConfigs(all_questions[current_question]);
      generated_question.total = total_questions;
      generated_question.index = current_question + 1;
      const stat_item: Record<string, any> = { ...generated_question };
      const total_correct = results.filter(result => result.verdict).length;
      if (play_options.instant_feedback) stat_item.total_correct = total_correct;
      const options_md5_map: Record<string, number> = {};
      if (generated_question.options) {
        generated_question.options.forEach((option, index) => options_md5_map[md5(option)] = index);
        generated_question.options = play_options.shuffle_options ? shuffle(generated_question.options) : generated_question.options;
      }
      return <Fragment>
        <Stats item={stat_item} stats={["quiz", "subject", "index", "total", "type", "format", "weight", "add_to_score", "time_allocated", "difficulty"]} />
        <Question hasEnd={current_question >= total_questions - 1} key={generated_question._id} question={generated_question} changeCounter={(user_answers: string[], time_taken: number, hints_used: number) => {
          const { weight, type, question, format, time_allocated, answers, add_to_score, explanation } = generated_question;
          user_answers = user_answers.filter(user_answer => user_answer !== "");
          let verdict = decideVerdict(type, answers, user_answers, generated_question.options, options_md5_map);
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
            explanation,
            hints_used
          }])
          setCurrentQuestion(current_question + 1)
        }} />
      </Fragment>
    }
    else return <Report results={results} />
  }

  return <div className="Quiz-container">
    {generateContent()}
  </div>
}
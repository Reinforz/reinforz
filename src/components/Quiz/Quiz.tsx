import React, { useState, Fragment } from "react";
import md5 from "md5";
import shortid from "shortid";
import { useTheme } from "@material-ui/styles";

import Question from "../Question/Question";
import Report from "../Report/Report";
import Stats from "../Basic/Stats";

import decideVerdict from "../../utils/decideVerdict";
import shuffle from "../../utils/arrayShuffler";

import { Result, QuizProps, QuestionInputFull, ExtendedTheme } from "../../types";

import "./Quiz.scss";

export default function Quiz(props: QuizProps) {
  const [current_question_index, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([] as Result[]);
  const { all_questions, play_options } = props;
  const total_questions = all_questions.length;
  const all_questions_map: Record<string, QuestionInputFull> = {};
  all_questions.forEach(question => all_questions_map[question._id] = question);
  const theme = useTheme() as ExtendedTheme;

  const generateContent = () => {
    if (current_question_index !== total_questions) {
      const current_question = all_questions[current_question_index];
      current_question.total = total_questions;
      current_question.index = current_question_index + 1;
      const stat_item: Record<string, any> = { ...current_question };
      const total_correct = results.filter(result => result.verdict).length;
      if (play_options.instant_feedback) stat_item.total_correct = total_correct;
      const options_md5_map: Record<string, number> = {};
      if (current_question.options) {
        current_question.options.forEach((option, index) => options_md5_map[md5(option)] = index);
        current_question.options = play_options.shuffle_options ? shuffle(current_question.options) : current_question.options;
      }

      return <Fragment>
        <Stats item={stat_item} stats={["quiz", "subject", "index", "total", "type", "format", "weight", "add_to_score", "time_allocated", "difficulty"]} />
        <Question hasEnd={current_question_index >= total_questions - 1} key={current_question._id} question={current_question} changeCounter={(user_answers: string[], time_taken: number, hints_used: number) => {
          const { difficulty, _id, weight, type, question, format, time_allocated, answers, add_to_score, explanation } = current_question;
          user_answers = user_answers.filter(user_answer => user_answer !== "");
          let verdict = decideVerdict(type, answers, user_answers, current_question.options, options_md5_map);
          setResults([...results, {
            user_answers,
            answers,
            verdict,
            add_to_score,
            score: weight * (verdict ? 1 : 0),
            question: format !== "code" ? question : "<Code/>",
            type,
            time_allocated,
            time_taken,
            explanation,
            hints_used,
            difficulty,
            question_id: _id,
            _id: shortid()
          }])
          setCurrentQuestion(current_question_index + 1)
        }} />
      </Fragment>
    }
    else return <Report results={results} all_questions_map={all_questions_map} />
  }

  return <div className="Quiz" style={{ backgroundColor: theme.color.base }}>
    {generateContent()}
  </div>
}
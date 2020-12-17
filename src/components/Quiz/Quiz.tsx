import React, { useState, Fragment } from "react";
import md5 from "md5";
import shortid from "shortid";
import clone from "just-clone";

import Question from "../Question/Question";
import Report from "../Report";
import Stats from "../Basic/Stats";

import { arrayShuffler, checkTextAnswer } from "../../utils";

import { Result, QuizProps, QuestionInputFull } from "../../types";

import { useThemeSettings, useCycle } from "../../hooks";

import "./Quiz.scss";

export default function Quiz(props: QuizProps) {
  const [results, setResults] = useState([] as Result[]),
    { theme } = useThemeSettings(),
    { is_last_item, current_item, getNextIndex, hasEnded, current_index } = useCycle(props.all_questions);

  const { all_questions, play_options, selected_quizzes } = props;
  const total_questions = all_questions.length;

  const generateContent = () => {
    if (!hasEnded) {
      const current_question = clone(current_item) as QuestionInputFull;
      const stat_item: Record<string, any> = clone(current_question);
      stat_item.total = total_questions;
      stat_item.current = current_index + 1;
      const total_correct = results.filter(result => result.verdict).length;
      if (play_options.instant_feedback) stat_item.total_correct = total_correct;
      const options_md5_map: Record<string, number> = {};
      if (current_question.options) {
        current_question.options.forEach((option, index) => options_md5_map[md5(option.toString())] = index);
        current_question.options = play_options.shuffle_options ? arrayShuffler(current_question.options) : current_question.options;
      }
      let total_correct_answers = 0;
      return <Fragment>
        <Stats item={stat_item} stats={["quiz.title", "quiz.subject", play_options.instant_feedback ? "total_correct" : undefined, "current", "total", "type", "format", "weight", "time_allocated", "difficulty"]} />
        <Question total={total_questions} index={current_index + 1} hasEnd={is_last_item} key={current_question._id} question={current_question} changeCounter={(user_answers: string[], time_taken: number, hints_used: number) => {
          const { quiz: { title, _id: quizId, subject }, difficulty, _id, weight, type, question, format, time_allocated, answers, explanation } = current_question;
          user_answers = user_answers.filter(user_answer => user_answer !== "");
          let verdict = false;
          if (type.match(/(MCQ|MS)/) && current_question.options && user_answers.length !== 0)
            user_answers = user_answers.map(user_answer => options_md5_map[md5((current_question.options as any)[parseInt(user_answer)])].toString());
          switch (type) {
            case "MCQ":
              verdict = answers.length === user_answers.length && answers[0].toString() === user_answers[0].toString();
              total_correct_answers = verdict ? 1 : 0
              break;
            case "MS":
              verdict = user_answers.length === answers.length && user_answers.every((user_answer) => {
                const isCorrect = (answers as string[]).includes(user_answer);
                if (isCorrect) total_correct_answers++
                return isCorrect
              });
              break;
            case "Snippet":
            case "FIB":
              verdict = user_answers.length === answers.length;
              total_correct_answers = checkTextAnswer(user_answers, answers);
              verdict = verdict && total_correct_answers === answers.length;
              break;
          }

          const correct_answers_score = 0.5 * (total_correct_answers / answers.length)
          const hints_score = (correct_answers_score / 0.5) * (0.2 - (hints_used * 0.067));
          const time_taken_score = (correct_answers_score / 0.5) * 0.3 * (1 / Math.ceil((time_taken + 1) / (time_allocated / 4)));

          setResults([...results, {
            user_answers,
            answers,
            verdict,
            score: weight * (play_options.partial_score ? Number((correct_answers_score + hints_score + time_taken_score).toFixed(2)) : (verdict ? 1 : 0)),
            question: format !== "code" ? question : "<Code/>",
            type,
            time_allocated,
            time_taken,
            explanation,
            hints_used,
            difficulty,
            question_id: _id,
            _id: shortid(),
            quiz: title, subject,
            quizId,
            weight
          }])
          getNextIndex();
        }} />
      </Fragment>
    }
    else return <Report setResults={setResults} selected_quizzes={selected_quizzes} results={results} all_questions_map={all_questions.reduce((acc, cur) => {
      acc[cur._id] = cur;
      return acc;
    }, {} as any)} />
  }

  return <div className="Quiz" style={{ backgroundColor: theme.color.base }}>
    {generateContent()}
  </div>
}
import clone from "just-clone";
import md5 from "md5";
import React, { Fragment, useState } from "react";
import { useCycle, useThemeSettings } from "../../hooks";
import { Stats } from "../../shared";
import { QuestionInputFull, QuizProps, Result } from "../../types";
import { arrayShuffler, getAnswerResult } from "../../utils";
import Question from "../Question/Question";
import Report from "../Report/Report";
import "./Quiz.scss";

export default function Quiz(props: QuizProps) {
  const [results, setResults] = useState([] as Result[]);
  const { all_questions, play_options, selected_quizzes } = props;
  const total_questions = all_questions.length;
  const { theme } = useThemeSettings();

  const { is_last_item, current_item, getNextIndex, hasEnded, current_index } = useCycle(all_questions);

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
      return <Fragment>
        <Stats item={stat_item} stats={["quiz.title", "quiz.subject", play_options.instant_feedback ? "total_correct" : undefined, "current", "total", "type", "format", "weight", "time_allocated", "difficulty"]} />
        <Question total={total_questions} index={current_index + 1} hasEnd={is_last_item} key={current_question._id} question={current_question} changeCounter={(user_answers, time_taken, hints_used) => {
          setResults([...results, getAnswerResult(current_question, user_answers, time_taken, hints_used, options_md5_map, play_options.partial_score)])
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
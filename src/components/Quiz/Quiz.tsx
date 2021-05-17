import React, { Fragment, useContext, useState } from "react";
import { useCycle, useThemeSettings } from "../../hooks";
import { Stats } from "../../shared";
import { TQuestionFull, TQuestionResult } from "../../types";
import { arrayShuffler, getAnswerResult } from "../../utils";
import { PlayContext } from "../Play/Play";
import Question from "../Question/Question";
import Report from "../Report/Report";
import "./Quiz.scss";

export default function Quiz() {
  const { playSettings, selectedQuizzes, allQuestions } = useContext(PlayContext);
  const [results, setResults] = useState([] as TQuestionResult[]);
  const { theme } = useThemeSettings();
  const { isLastItem, currentItem, getNextIndex, hasEnded, currentIndex } = useCycle(allQuestions);

  const totalQuestions = allQuestions.length,
    totalCorrectAnswers = results.filter(result => result.verdict).length;

  const generateContent = () => {
    if (!hasEnded) {
      const currentQuestion = JSON.parse(JSON.stringify(currentItem)) as TQuestionFull;
      if (currentQuestion.options) {
        currentQuestion.options = playSettings.options.shuffle_options ? arrayShuffler(currentQuestion.options) : currentQuestion.options;
      }
      return <Fragment>
        <Stats items={[["Quiz Title", currentQuestion.quiz.title], ["Quiz Subject", currentQuestion.quiz.subject], ['Total Correct', totalCorrectAnswers], ["Current", currentIndex + 1], ["Total", totalQuestions], ["Type", currentQuestion.type], ["Format", currentQuestion.format], ["Weight", currentQuestion.weight], ["Time Allocated", currentQuestion.time_allocated], ["Difficulty", currentQuestion.difficulty]]} />
        <Question isLast={isLastItem} question={currentQuestion} changeCounter={(user_answers, time_taken, hints_used) => {
          setResults([...results, { ...currentQuestion, ...getAnswerResult(currentQuestion, user_answers, time_taken, hints_used, playSettings.options.partial_score), time_taken, hints_used, question_id: currentQuestion._id, user_answers }])
          getNextIndex();
        }} />
      </Fragment>
    }
    else return <Report setResults={setResults} selected_quizzes={selectedQuizzes as any} results={results} all_questions_map={allQuestions.reduce((acc, cur) => {
      acc[cur._id] = cur;
      return acc;
    }, {} as any)} />
  }

  return <div className="Quiz" style={{ backgroundColor: theme.color.base }}>
    {generateContent()}
  </div>
}
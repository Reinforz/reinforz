import React, { useState, Fragment } from "react";

import "./Play.scss";

import Upload from "./Upload";
import Quiz from "./Quiz";
import PlaySettings from "./PlaySettings";
import QuestionStats from "./QuestionStats";
import List from "./List";
import shuffle from "../utils/arrayShuffler";

import {
  QuestionInputFull,
  IPlayOptions,
  QuizInputPartial,
  PlaySettingsRProps,
  ListRProps
} from "../types";

function Play() {
  const [playing, setPlaying] = useState(false);
  const [quizzes, setQuizzes] = useState([] as any[]);

  function renderQuiz(selectedQuizzes: string[], play_options: IPlayOptions) {
    let filtered_quizzes = quizzes.filter(quiz => selectedQuizzes.includes(quiz._id)) as QuizInputPartial[];
    const all_questions: QuestionInputFull[] = [];
    if (play_options.shuffle_quizzes && !play_options.flatten_mix) filtered_quizzes = shuffle(filtered_quizzes);
    if (play_options.shuffle_questions && !play_options.flatten_mix) filtered_quizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
    filtered_quizzes.forEach(quiz => {
      quiz.questions = quiz.questions.map((question) => {
        return {
          ...question,
          quiz: quiz.title,
          subject: quiz.subject
        }
      });
      all_questions.push(...quiz.questions as QuestionInputFull[]);
    });
    return play_options.flatten_mix ? shuffle(all_questions) : all_questions;
  }

  return (
    <List header="Uploaded Quizzes" items={quizzes} setItems={setQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
      {({ ListComponent, list_state, list_manips }: ListRProps) => {
        return <PlaySettings setPlaying={setPlaying} selectedQuizzes={list_state.selectedItems}>
          {({ PlaySettings, play_options }: PlaySettingsRProps) => {
            return <Fragment>
              {!playing ?
                <div className="Play">
                  <QuestionStats quizzes={quizzes} />
                  <Upload selectedItems={list_state.selectedItems} setSelectedItems={list_manips.setSelectedItems} setItems={setQuizzes} items={quizzes} />
                  {ListComponent}
                  {PlaySettings}
                </div>
                : <Quiz play_options={play_options} all_questions={renderQuiz(list_state.selectedItems, play_options)} />}
            </Fragment>
          }}
        </PlaySettings>
      }}
    </List>
  );
}

export default Play;
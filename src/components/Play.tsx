import React, { useState, Fragment } from "react";


import Upload from "./Upload";
import Quiz from "./Quiz";
import PlayOptions from "./PlayOptions";
import "./Play.scss";
import List from "./List";
import {
  QuestionInputPartial,
  IPlayOptions,
  QuizInputPartial,
  PlayOptionsRProps,
  ListRProps
} from "../types";
import shuffle from "../utils/arrayShuffler";

function Play() {
  const [playing, setPlaying] = useState(false);
  const [quizzes, setQuizzes] = useState([] as any[]);

  function renderQuiz(selectedQuizzes: string[], play_options: IPlayOptions) {
    let filtered_quizzes = quizzes.filter(quiz => selectedQuizzes.includes(quiz._id)) as QuizInputPartial[];
    let all_questions: QuestionInputPartial[] = [];
    if (play_options.shuffle_quizzes && !play_options.flatten_mix) filtered_quizzes = shuffle(filtered_quizzes);
    if (play_options.shuffle_questions && !play_options.flatten_mix) filtered_quizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
    filtered_quizzes.forEach(quiz => {
      quiz.questions.forEach((question) => {
        question.quiz = quiz.title;
        question.subject = quiz.subject;
      });
      all_questions.push(...quiz.questions);
    });
    if (play_options.flatten_mix) all_questions = shuffle(all_questions);
    return all_questions;
  }

  return (
    <List header="Uploaded Quizzes" items={quizzes} setItems={setQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
      {({ ListComponent, list_state }: ListRProps) => {
        return <PlayOptions setPlaying={setPlaying} selectedQuizzes={list_state.selectedItems}>
          {({ PlayOptions, play_options }: PlayOptionsRProps) => {
            return <Fragment>
              {!playing ?
                <div className="Play">
                  <Upload setItems={setQuizzes} items={quizzes} />
                  {ListComponent}
                  {PlayOptions}
                </div>
                : <Quiz play_options={play_options} all_questions={renderQuiz(list_state.selectedItems, play_options)} />}
            </Fragment>
          }}
        </PlayOptions>
      }}
    </List>
  );
}

export default Play;
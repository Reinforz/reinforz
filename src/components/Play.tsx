import React, { useState, Fragment } from "react";


import Upload from "./Upload";
import Quiz from "./Quiz";
import PlayOptions from "./PlayOptions";
import "./Play.scss";
import List from "./List";
import {
  QuestionInputFull,
  IPlayOptions,
  QuizInputPartial,
  PlayOptionsRProps,
  ListRProps
} from "../types";
import shuffle from "../utils/arrayShuffler";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";

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
          ...generateQuestionInputConfigs(question),
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
        return <PlayOptions setPlaying={setPlaying} selectedQuizzes={list_state.selectedItems}>
          {({ PlayOptions, play_options }: PlayOptionsRProps) => {
            return <Fragment>
              {!playing ?
                <div className="Play">
                  <Upload selectedItems={list_state.selectedItems} setSelectedItems={list_manips.setSelectedItems} setItems={setQuizzes} items={quizzes} />
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
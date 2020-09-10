import React, { useState, Fragment } from "react";

import PlayUpload from "./PlayUpload/PlayUpload";
import Quiz from "../Quiz/Quiz";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import List from "../Basic/List";
import PlayErrorLogs from "./PlayErrorLogs/PlayErrorLogs";

import shuffle from "../../utils/arrayShuffler";

import {
  QuestionInputFull,
  QuizInputFull,
  IPlaySettingsRProps,
  ListRProps,
  QuestionDifficulty,
  QuestionType,
  IPlaySettingsState,
} from "../../types";

import "./Play.scss";


function Play() {
  const [playing, setPlaying] = useState(false);
  const [quizzes, setQuizzes] = useState([] as any[]);

  function renderQuiz(selectedQuizzes: string[], play_state: IPlaySettingsState) {
    const { play_options, play_filters } = play_state;
    let filtered_quizzes = quizzes.filter(quiz => selectedQuizzes.includes(quiz._id)) as QuizInputFull[];
    const all_questions: QuestionInputFull[] = [];
    if (play_options.shuffle_quizzes && !play_options.flatten_mix) filtered_quizzes = shuffle(filtered_quizzes);
    if (play_options.shuffle_questions && !play_options.flatten_mix) filtered_quizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
    filtered_quizzes.forEach(quiz => {
      quiz.questions = quiz.questions.filter(question => !play_filters.excluded_difficulty.includes(question.difficulty as QuestionDifficulty) && !play_filters.excluded_types.includes(question.type as QuestionType) && play_filters.time_allocated[0] <= question.time_allocated && play_filters.time_allocated[1] >= question.time_allocated).map((question) => {
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
      {({ ListComponent, ListState, ListUtils }: ListRProps) => {
        return <PlaySettings setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
          {({ PlaySettingsComponent, PlaySettingsState }: IPlaySettingsRProps) => {
            return <Fragment>
              {!playing ?
                <div className="Play">
                  <PlayTable quizzes={quizzes} />
                  <PlayErrorLogs quizzes={quizzes} />
                  <PlayUpload selectedItems={ListState.selectedItems} setSelectedItems={ListUtils.setSelectedItems} setItems={setQuizzes} items={quizzes} />
                  {ListComponent}
                  {PlaySettingsComponent}
                  <div className="Help">Need help, <a href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
                </div>
                : <Quiz play_options={PlaySettingsState.play_options} all_questions={renderQuiz(ListState.selectedItems, PlaySettingsState)} />}
            </Fragment>
          }}
        </PlaySettings>
      }}
    </List>
  );
}

export default Play;
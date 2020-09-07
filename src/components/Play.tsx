import React, { useState, Fragment } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import styled from 'styled-components';

import Upload from "./Upload";
import Quiz from "./Quiz";
import PlayOptions from "./PlayOptions";
import "./Play.scss";
import List from "./List";
import {
  QuestionInputPartial,
  QuizInputPartial, IPlayOptions,
  PlayOptionsRProps
} from "../types";
import shuffle from "../utils/arrayShuffler";

interface PlayProps {
  quizzes: QuizInputPartial[],
  setQuizzes: (data: any[]) => any
}

const CancelIconW = styled(CancelIcon)`
  margin: 5px;
  cursor: pointer;
  fill: #F44336 !important;
  transition: transform 200ms ease-in-out;
  &:hover{
    transform: scale(1.15);
    transition: transform 200ms ease-in-out;
  }
`;

function Play(props: PlayProps) {
  const [playing, setPlaying] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([] as any[]);

  function renderQuiz(play_options: IPlayOptions) {
    let quizzes = props.quizzes.filter(quiz => selectedQuizzes.includes(quiz._id))
    let all_questions: QuestionInputPartial[] = [];
    if (play_options.shuffle_quizzes && !play_options.flatten_mix) quizzes = shuffle(quizzes);
    if (play_options.shuffle_questions && !play_options.flatten_mix) quizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
    quizzes.forEach(quiz => {
      quiz.questions.forEach(question => {
        question.quiz = quiz.title;
        question.subject = quiz.subject;
      });
      all_questions.push(...quiz.questions);
    });
    if (play_options.flatten_mix) all_questions = shuffle(all_questions);
    return all_questions;
  }

  return (
    <PlayOptions setPlaying={setPlaying} selectedQuizzes={selectedQuizzes}>
      {({ PlayOptions, play_options }: PlayOptionsRProps) => {
        return <Fragment>
          {!playing ?
            <div className="Play">
              <Upload {...props} />
              <List header="Uploaded Quizzes" items={props.quizzes} icons={[(index, _id) => {
                return <Checkbox key={_id + "checkbox" + index} onClick={(e) => {
                  if ((e.target as any).checked) setSelectedQuizzes([...selectedQuizzes, _id])
                  else setSelectedQuizzes(selectedQuizzes.filter(selectedQuiz => selectedQuiz !== _id))
                }} checked={selectedQuizzes.includes(_id)} value={_id} />
              }, (index, _id) => <CancelIconW key={_id + "icon" + index} onClick={() => {
                props.setQuizzes(props.quizzes.filter(quiz => quiz._id !== _id));
              }} />]} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
              {PlayOptions}
            </div>
            : <Quiz all_questions={renderQuiz(play_options)} />}
        </Fragment>
      }}
    </PlayOptions>
  );
}

export default Play;
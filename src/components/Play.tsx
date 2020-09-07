import React, { useState, Fragment } from "react";
import { Checkbox, Button } from "@material-ui/core";

import Quiz from "./Quiz";
import PlayOptions from "./PlayOptions";
import "./Play.scss";
import List from "./List";
import {
  QuizInputPartial,/* IPlayOptions, */
  PlayOptionsRProps
} from "../types";

interface PlayProps {
  quizzes: QuizInputPartial[]
}

function Play(props: PlayProps) {
  const [playing, setPlaying] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([] as any[]);

  return (
    <PlayOptions>
      {({ PlayOptions }: PlayOptionsRProps) => {
        return <Fragment>
          {!playing ?
            <div className="Play">
              <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
                <List header="Uploaded Quizzes" items={props.quizzes} icons={[(index, _id) => {
                  return <Checkbox key={_id + "checkbox" + index} onClick={(e) => {
                    if ((e.target as any).checked) setSelectedQuizzes([...selectedQuizzes, _id])
                    else setSelectedQuizzes(selectedQuizzes.filter(selectedQuiz => selectedQuiz !== _id))
                  }} checked={selectedQuizzes.includes(_id)} value={_id} />
                }]} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
                {PlayOptions}
              </div>
              <Button color="primary" style={{ margin: "0 auto", fontSize: "1rem" }} variant="contained" onClick={() => setPlaying(true)}>Start</Button>
            </div>
            : <Quiz quizzes={props.quizzes.filter(quiz => selectedQuizzes.includes(quiz._id))} />}
        </Fragment>
      }}
    </PlayOptions>
  );
}

export default Play;
import React, { useState } from "react";
import { Checkbox, Button } from "@material-ui/core";

import Quiz from "./Quiz";
import List from "./List";
import { QuizInputPartial } from "../types";

interface PlayProps {
  quizzes: QuizInputPartial[]
}

function Play(props: PlayProps) {
  const [playing, setPlaying] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([] as any[]);

  return (
    <div className="Play">
      <List items={props.quizzes} icons={[(index, _id) => {
        return <Checkbox key={_id + "checkbox" + index} onClick={(e) => {
          if ((e.target as any).checked) setSelectedQuizzes([...selectedQuizzes, _id])
          else setSelectedQuizzes(selectedQuizzes.filter(selectedQuiz => selectedQuiz !== _id))
        }} checked={selectedQuizzes.includes(_id)} value={_id} />
      }]} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
      {!playing ? <Button variant="contained" onClick={() => setPlaying(true)}>Start</Button> : <Quiz quizzes={props.quizzes.filter(quiz => selectedQuizzes.includes(quiz._id))} />}
    </div>
  );
}

export default Play;
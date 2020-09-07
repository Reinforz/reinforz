import styled from "styled-components";
import React, { useState } from "react";
import Button from "@material-ui/core/Button"

import Timer from "./Timer";
import Stats from "./Stats";
import { QuestionInputPartial, TimerRProps } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";
import Highlighter from "./Highlighter";
import Options from "./Options";

const QuestionContainer = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionContainerQuestion = styled.div`
  user-select: none;
  font-weight: bolder;
  font-size: 1.5rem;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Question(props: QuestionInputPartial): JSX.Element {
  const generated_question_inputs = generateQuestionInputConfigs(props);
  const { results, question, type, image, format, time_allocated, index, total, } = generated_question_inputs;

  const generateQuestion = () => {
    if (format === "html") return <Highlighter language={"typescript"} code={question} />
    else return <QuestionContainerQuestion className="Question-container-item Question-container-question">{question}</QuestionContainerQuestion>
  }

  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(question.match(/(\$\{_\})/g)?.length ?? 1).fill('') as string[] : ['']);
  const exhausted_questions = index >= total;
  const total_correct = results.filter(result => result.verdict).length;
  return <Timer timeout={time_allocated} onTimerEnd={() => {
    props.changeCounter(generated_question_inputs, user_answers, time_allocated)
  }}>
    {(timerprops: TimerRProps) => {
      return <QuestionContainer className="Question-container">
        <Stats item={{ ...generated_question_inputs, total_correct }} stats={["quiz", "subject", "index", "total", "type", "format", "weight", "add_to_score", "time_allocated", "difficulty"]} />
        {image && <div className="Question-container-item Question-container-image"><img src={image} alt="question" /></div>}
        {generateQuestion()}
        <Options changeOption={changeUserAnswers} user_answers={user_answers} question={generated_question_inputs} />
        {timerprops.timer}
        <Button className="Quiz-container-button" variant="contained" color="primary" onClick={() => {
          props.changeCounter(generated_question_inputs, user_answers, time_allocated - timerprops.currentTime)
        }}>{!exhausted_questions ? "Next" : "Report"}</Button>
      </QuestionContainer>
    }}
  </Timer>
}

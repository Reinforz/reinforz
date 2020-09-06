import styled from "styled-components";
import React, { useState } from "react";
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/styles";

import Timer from "./Timer";
import { QuestionInputPartial, QuestionInputKeys, TimerRProps } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, TextField } from "@material-ui/core";
import Highlighter from "./Highlighter";

const styles = makeStyles({
  radio_root: {
    color: 'rgba(255,255,255,0.75)'
  }
});

const QuestionContainer = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionContainerStats = styled.div`
  user-select: none;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  background-color : #1b1b1b;
  border-radius: 3px;
  margin: 20px;
  padding: 5px;
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

const QuestionContainerStatsItem = styled.div`
  user-select: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 5px;

  .value{
    padding: 2px 5px;
    border-radius: 3px; 
    background-color: #2c2c2c;
  }
`;

const QuestionContainerOptions = `
  display: grid !important; 
  width: 100%;
  grid-template-columns: 1fr 1fr;
  background: #1b1b1b;
`;

const QuestionContainerOptionItem = styled.div`
  padding: 5px;
  cursor: pointer;
  margin: 5px;
  background: #353232;
  border-radius: 5px;
  color: #ddd;
  display: flex;
  justify-content: flex-start;
  .MuiInputBase-root{
    color: #ddd;
  }
  .MuiTypography-body1{
    font-size: 1.25rem;
    font-weight: 500;
  }
  .MuiFormControlLabel-root{
    width: 100%;
  }
`;

const QuestionContainerOptionsRadioGroup = styled(RadioGroup)`
  ${QuestionContainerOptions}
`;

const QuestionContainerOptionsFormGroup = styled(FormGroup)`
  ${QuestionContainerOptions}
`;

export default function Question(props: QuestionInputPartial): JSX.Element {
  const generated_question_inputs = generateQuestionInputConfigs(props);
  const { results, question, type, image, format, time_allocated, options, index, total, _id } = generated_question_inputs;
  const classes = styles();

  const generateQuestion = () => {
    if (format === "html") return <Highlighter language={"typescript"} code={question} />
    else return <QuestionContainerQuestion className="Question-container-item Question-container-question">{question}</QuestionContainerQuestion>
  }

  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(question.match(/(\$\{_\})/g)?.length ?? 1).fill('') as string[] : ['']);

  const generateOptions = () => {
    if (type === "MCQ" && options)
      return <QuestionContainerOptionsRadioGroup className="Question-container-options" defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} row>
        {options.map((option, i) => (
          <QuestionContainerOptionItem className={`Question-container-options-item`} key={`${_id}option${index}${i}`} onClick={(e) => {
            const tagname = (e.target as any).tagName;
            const clicked_on_input = tagname === "INPUT";
            let input = null;
            if (clicked_on_input) input = e.target;
            else if (tagname === "SPAN") input = (e.target as any).previousElementSibling.querySelector("input")
            else input = (e.target as any).querySelector("input");
            changeUserAnswers([input.value])
          }}>
            <FormControlLabel
              control={<Radio color="primary" className={classes.radio_root} />}
              value={`${i}`}
              label={option.toString()}
              labelPlacement="end"
            />
          </QuestionContainerOptionItem>
        ))}
      </QuestionContainerOptionsRadioGroup>
    else if (type === "MS" && options) {
      const temp_user_answers = [...(user_answers as string[])];
      return <QuestionContainerOptionsFormGroup row>
        {options.map((option, i) => (
          <QuestionContainerOptionItem className={`Question-container-options-item`} key={`${_id}option${index}${i}`} onClick={(e) => {
            const tagname = (e.target as any).tagName;
            const clicked_on_input = tagname === "INPUT";
            let input = null;
            if (clicked_on_input) input = e.target;
            else if (tagname === "SPAN") input = (e.target as any).previousElementSibling.querySelector("input")
            else input = (e.target as any).querySelector("input");
            if ((clicked_on_input && input.checked) || (!clicked_on_input && input.checked)) {
              temp_user_answers.push(`${i}`);
              changeUserAnswers([...temp_user_answers])
            }
            else
              changeUserAnswers(temp_user_answers.filter(temp_user_answer => temp_user_answer !== `${i}`));
          }}>
            <FormControlLabel
              control={<Checkbox className={classes.radio_root} checked={temp_user_answers.includes(`${i}`)} value={`${i}`} />}
              label={option.toString()}
            /></QuestionContainerOptionItem>))}
      </QuestionContainerOptionsFormGroup>
    }

    else if (type === "FIB")
      return (question.match(/(\$\{_\})/g) as string[]).map((_, i) =>
        <QuestionContainerOptionItem className={`Question-container-options-item`} key={`${_id}option${index}${i}`}>
          <TextField fullWidth value={user_answers[i]} onChange={e => {
            user_answers[i] = e.target.value;
            changeUserAnswers([...user_answers])
          }} /></QuestionContainerOptionItem>)

    else if (type === "Snippet")
      return <QuestionContainerOptionItem className={`Question-container-options-item`}>
        <TextField fullWidth value={user_answers[0]} onChange={e => {
          user_answers[0] = e.target.value;
          changeUserAnswers([...user_answers])
        }} /></QuestionContainerOptionItem>
  }
  const exhausted_questions = index >= total;
  const total_correct = results.filter(result => result.verdict).length;
  return <Timer timeout={time_allocated} onTimerEnd={() => {
    props.changeCounter(generated_question_inputs, user_answers, time_allocated)
  }}>
    {(timerprops: TimerRProps) => {
      return <QuestionContainer className="Question-container">
        <QuestionContainerStats className="Question-container-stats Question-container-item">
          <QuestionContainerStatsItem key={`${_id}question-total_correct`} className={`Question-container-stats-item Question-container-stats-total_correct`}><span>Total Correct: </span><span style={{ color: "#36e336" }} className={"value"}>{total_correct.toString()}</span></QuestionContainerStatsItem>
          {(["index", "total", "type", "format", "weight", "add_to_score", "time_allocated", "difficulty"] as QuestionInputKeys).map(stat => <QuestionContainerStatsItem key={`${_id}question-${stat}`} className={`Question-container-stats-item Question-container-stats-${stat}`}><span>{stat.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ") + ": "}</span><span className={"value"}>{generated_question_inputs[stat].toString()}</span></QuestionContainerStatsItem>)}
        </QuestionContainerStats>
        {image && <div className="Question-container-item Question-container-image"><img src={image} alt="question" /></div>}
        {generateQuestion()}
        {generateOptions()}
        {timerprops.timer}
        <Button className="Quiz-container-button" variant="contained" color="primary" onClick={() => {
          props.changeCounter(generated_question_inputs, user_answers, time_allocated - timerprops.currentTime)
        }}>{!exhausted_questions ? "Next" : "Report"}</Button>
      </QuestionContainer>
    }}
  </Timer>
}

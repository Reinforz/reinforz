import styled from "styled-components";
import React, { useState } from "react";
import Button from "@material-ui/core/Button"

import Timer from "./Timer";
import { QuestionInputPartial, QuestionInputKeys } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, TextField } from "@material-ui/core";

interface QuestionContainerQuestionProps {
  hasHTMLLiteral: boolean
}

const QuestionContainer = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionContainerStats = styled.div`
  user-select: none;
  width: 50%;
  min-width: 250px;
  max-width: 500px;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
`;

const QuestionContainerQuestion = styled.div<QuestionContainerQuestionProps>`
  user-select: none;
  font-weight: bolder;
  font-size: 1.5rem;
  height: 150px;
  ${props => !props.hasHTMLLiteral ? `display: flex;
  justify-content: center;
  align-items: center;` : ''}
` as any;

const QuestionContainerStatsItem = styled.div`
  user-select: none;
  font-weight: 500;
  font-size: 1rem;
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
`;

const QuestionContainerOptionsRadioGroup = styled(RadioGroup)`
  ${QuestionContainerOptions}
`;

const QuestionContainerOptionsFormGroup = styled(FormGroup)`
  ${QuestionContainerOptions}
`;

export default function Question(props: QuestionInputPartial): JSX.Element {
  const generated_question_inputs = generateQuestionInputConfigs(props);
  const { question, type, image, format, answers, options,index,total } = generated_question_inputs;

  const generateQuestion = () => {
    if (format === "html") return <QuestionContainerQuestion hasHTMLLiteral={true} className="Question-container-item Question-container-question" dangerouslySetInnerHTML={{ __html: question }} />
    else return <QuestionContainerQuestion hasHTMLLiteral={false} className="Question-container-item Question-container-question">{question}</QuestionContainerQuestion>
  }

  const [user_answers, changeUserAnswers] = useState(type === "FIB" ? Array(question.match(/(\$\{\_\})/g)?.length ?? 1).fill('') as string[] : ['']);

  const generateOptions = () => {
    if (type === "MCQ" && options)
      return <QuestionContainerOptionsRadioGroup className="Question-container-options" defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} onChange={(e) => {
        changeUserAnswers([e.target.value])
      }} row>
        {options.map((option, index) => (
          <QuestionContainerOptionItem className={`Question-container-options-item`} key={option + index}>
            <FormControlLabel
              control={<Radio color="primary" />}
              value={`${index}`}
              label={option}
              labelPlacement="end"
            />
          </QuestionContainerOptionItem>
        ))}
      </QuestionContainerOptionsRadioGroup>
    else if (type === "MS" && options) {
      const temp_user_answers = [...(user_answers as string[])];
      return <QuestionContainerOptionsFormGroup row>
        {options.map((option, index) => (
          <QuestionContainerOptionItem className={`Question-container-options-item`} key={option + index}>
            <FormControlLabel
              control={<Checkbox checked={temp_user_answers.includes(`${index}`)} value={`${index}`} onChange={(e) => {
                if (e.target.checked) {
                  temp_user_answers.push(`${index}`);
                  changeUserAnswers([...temp_user_answers])
                }
                else
                  changeUserAnswers(temp_user_answers.filter(temp_user_answer => temp_user_answer !== `${index}`));
              }} />}
              label={option}
            /></QuestionContainerOptionItem>))}
      </QuestionContainerOptionsFormGroup>
    }

    else if (type === "FIB")
      return (question.match(/(\$\{\_\})/g) as string[]).map((_, i) =>
        <QuestionContainerOptionItem className={`Question-container-options-item`} key={_ + i}>
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

  return <Timer timeout={generated_question_inputs.time_allocated} onTimerEnd={()=>{
    props.changeCounter(generated_question_inputs,user_answers)
  }}>
    {(timerprops: any) => {
      return <QuestionContainer className="Question-container">
        <QuestionContainerStats className="Question-container-stats Question-container-item">
          {(["index", "total", "type", "format", "weight", "add_to_score", "time_allocated", "difficulty"] as QuestionInputKeys).map(stat => <QuestionContainerStatsItem key={`question-${stat}`} className={`Question-container-stats-item Question-container-stats-${stat}`}>{generated_question_inputs[stat]}</QuestionContainerStatsItem>)}
        </QuestionContainerStats>
        {image && <div className="Question-container-item Question-container-image"><img src={image} /></div>}
        {generateQuestion()}
        {generateOptions()}
        {timerprops.timer}
        <Button className="Quiz-container-button" variant="contained" color="primary" onClick={() => {
          props.changeCounter(generated_question_inputs, user_answers)
        }}>{!exhausted_questions ? "Next" : "Report"}</Button>
      </QuestionContainer>
    }}
  </Timer>
}

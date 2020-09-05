import styled from "styled-components";
import React, { useState } from "react";

import { QuestionInputPartial, QuestionInputKeys } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox } from "@material-ui/core";
import { formatWithOptions } from "util";

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

  const { question, type, image, format, answers, options } = generated_question_inputs;

  const generateQuestion = () => {
    if (format === "html") return <QuestionContainerQuestion hasHTMLLiteral={true} className="Question-container-item Question-container-question" dangerouslySetInnerHTML={{ __html: question }} />
    else return <QuestionContainerQuestion hasHTMLLiteral={false} className="Question-container-item Question-container-question">{question}</QuestionContainerQuestion>
  }

  const [user_answers, changeUserAnswers] = useState(['']);
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
    else if (type === "MS" && options)
      return <QuestionContainerOptionsFormGroup row>
        {options.map((option, index) => (
          <QuestionContainerOptionItem className={`Question-container-options-item`} key={option + index}>
            <FormControlLabel
              control={<Checkbox checked={user_answers.includes(`${index}`)} value={`${index}`} onChange={(e) => {
                if (e.target.checked) {
                  (user_answers as string[]).push(`${index}`);
                  changeUserAnswers([...user_answers])
                }
                else
                  changeUserAnswers(user_answers.filter(user_answer => user_answer !== `${index}`));
              }} />}
              label={option}
            /></QuestionContainerOptionItem>))}
      </QuestionContainerOptionsFormGroup>
  }

  return <QuestionContainer className="Question-container">
    <QuestionContainerStats className="Question-container-stats Question-container-item">
      {(["index", "total", "type", "format", "weight", "add_to_score", "time_allocated", "difficulty"] as QuestionInputKeys).map(stat => <QuestionContainerStatsItem key={`question-${stat}`} className={`Question-container-stats-item Question-container-stats-${stat}`}>{generated_question_inputs[stat]}</QuestionContainerStatsItem>)}
    </QuestionContainerStats>
    {image && <div className="Question-container-item Question-container-image"><img src={image} /></div>}
    {generateQuestion()}
    {generateOptions()}
  </QuestionContainer>
}
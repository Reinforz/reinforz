import styled from "styled-components";
import React from "react";

import { QuestionInputPartial, QuestionInputKeys } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";

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

const QuestionContainerOptions = styled.div`
  display: grid; 
  width: 100%;
  grid-template-columns: 1fr 1fr;
  background: #1b1b1b;
`;

const QuestionContainerOptionItem = styled.div`
  font-size: 1.25rem;
  padding: 5px;
  font-weight: bold;
  cursor: pointer;
  margin: 5px;
  background: #353232;
  border-radius: 5px;
  color: #ddd;
`;

export default function Question(props: QuestionInputPartial): JSX.Element{
  const generated_question_inputs = generateQuestionInputConfigs(props);

  const {question,type,image,format,answers,options,correct_answer_message,incorrect_answer_message,explanation} = generated_question_inputs;

  const generateQuestion = ()=>{
    if(format === "html") return <QuestionContainerQuestion hasHTMLLiteral={true} className="Question-container-item Question-container-question" dangerouslySetInnerHTML={{__html: question}}/>
    else return <QuestionContainerQuestion hasHTMLLiteral={false} className="Question-container-item Question-container-question">{question}</QuestionContainerQuestion>
  }

  const generateOptions = () => {
    return type.match(/(MS|MCQ)/) ? 
      <QuestionContainerOptions className="Question-container-options">
        {options && options.map((option,index)=><QuestionContainerOptionItem className={`Question-container-options-item`} key={option+index}>{option}</QuestionContainerOptionItem>)}
      </QuestionContainerOptions>
    : null
  }

  return <QuestionContainer className="Question-container">
    <QuestionContainerStats className="Question-container-stats Question-container-item">
      {(["index","total","type","format","weight","add_to_score","time_allocated","difficulty"] as QuestionInputKeys).map(stat=><QuestionContainerStatsItem key={`question-${stat}`} className={`Question-container-stats-item Question-container-stats-${stat}`}>{generated_question_inputs[stat]}</QuestionContainerStatsItem>)}
    </QuestionContainerStats>
    {image && <div className="Question-container-item Question-container-image"><img src={image}/></div>}
    {generateQuestion()}
    {generateOptions()}
  </QuestionContainer>
}
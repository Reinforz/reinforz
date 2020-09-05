import styled from "styled-components";
import React from "react";

import { QuestionInputPartial, QuestionInputKeys } from "../types";
import { generateQuestionInputConfigs } from "../utils/generateConfigs";

interface QuestionContainerQuestionProps {
  hasHTMLLiteral: boolean
}

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionContainerStats = styled.div`
  width: 50%;
  min-width: 250px;
  max-width: 500px;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
`;

const QuestionContainerQuestion = styled.div<QuestionContainerQuestionProps>`
  font-weight: bolder;
  font-size: 1.5rem;
  height: 150px;
  ${props => !props.hasHTMLLiteral ? `display: flex;
  justify-content: center;
  align-items: center;` : ''}
` as any;

const QuestionContainerStatsItem = styled.div`
  font-weight: 500;
  font-size: 1rem;
`;

export default function Question(props: QuestionInputPartial): JSX.Element{
  const generated_question_inputs = generateQuestionInputConfigs(props);

  const {question,image,format,answers,options,correct_answer_message,incorrect_answer_message,explanation} = generated_question_inputs;

  const generateHTML = ()=>{
    if(format === "html") return <QuestionContainerQuestion hasHTMLLiteral={true} className="Question-container-item Question-container-question" dangerouslySetInnerHTML={{__html: question}}/>
    else return <QuestionContainerQuestion hasHTMLLiteral={false} className="Question-container-item Question-container-question">{question}</QuestionContainerQuestion>
  }
  return <QuestionContainer className="Question-container">
    <QuestionContainerStats className="Question-container-stats Question-container-item">
      {(["index","total","type","format","weight","add_to_score","time_allocated","difficulty"] as QuestionInputKeys).map(stat=><QuestionContainerStatsItem key={`question-${stat}`} className={`Question-container-stats-item Question-container-stats-${stat}`}>{generated_question_inputs[stat]}</QuestionContainerStatsItem>)}
    </QuestionContainerStats>
    {image && <div className="Question-container-item Question-container-image"><img src={image}/></div>}
    {generateHTML()}
  </QuestionContainer>
}
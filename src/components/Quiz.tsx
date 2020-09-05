import React, { useState, Fragment,useEffect } from "react";
import Button from "@material-ui/core/Button"

import { QuizInputPartial } from "../types";
import Question from "./Question";

export default class Quiz extends React.Component<QuizInputPartial>{
  state = {
    current_question: 0
  }
  render(){
    const {current_question} = this.state;
    const {props} = this; 
    const question = props.questions[current_question];
    const key = current_question + question.question.toLowerCase().replace(/\s/g, '');
    const total_questions = props.questions.length;
    const exhausted_questions = current_question >= total_questions - 1;
    
    return <div className="Quiz-container">
      <Question key={key} {...question} total={total_questions} index={current_question + 1} changeCounter={()=>{!exhausted_questions && this.setState({current_question: current_question+1})}}/>
      <Button className="Quiz-container-button" variant="contained" color="primary" onClick={() => !exhausted_questions && this.setState({current_question:current_question + 1})}>{!exhausted_questions ? "Next" : "Report"}</Button>
    </div>
  }
}
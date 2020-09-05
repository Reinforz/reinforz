import React from 'react';

import Quiz from "./components/Quiz"

import './App.css';
import { QuizInputPartial } from './types';

const QuizData: QuizInputPartial={
  title: "Typescript Basic Types",
  subject: "Typescript",
  questions: [{
    question:"Which of the following is not a basic type in TS?",
    answers: ["0"],
    options:["Generic","undefined","null","boolean","void"]
  }]
};


function App() {
  return (
    <div className="App">
      <Quiz {...QuizData}/>
    </div>
  );
}

export default App;

import React,{useState} from 'react';
import yaml from 'js-yaml';
import shortid from "shortid"

import Quiz from "./components/Quiz"

import './App.css';
import shuffle from './utils/arrayShuffler';

function App() {
  let [QuizData, setQuizData] = useState({} as any)
  if(!QuizData.title)
    fetch("http://localhost:3000/test.yaml").then(data=>data.text()).then(data=>{
      QuizData = yaml.safeLoad(data)
      QuizData.questions = shuffle(QuizData.questions);
      QuizData.questions.forEach((question:any)=>question._id = shortid())
      setQuizData(QuizData);
    });
  return (
    <div className="App">
      {QuizData.title ? <Quiz {...QuizData}/> : 'Loading data'}
    </div>
  );
}

export default App;

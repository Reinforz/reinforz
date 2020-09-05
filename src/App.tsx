import React from 'react';

import Quiz from "./components/Quiz"

import './App.css';
import { QuizInputPartial } from './types';

const QuizData: QuizInputPartial={
  title: "Typescript Basic Types",
  subject: "Typescript",
  questions: [
    {
      "question": "Which of the following are not basic types in TS",
      "answers": [
        6,
        7
      ],
      "options": [
        "void",
        "struct",
        "enums",
        "undefined",
        "null",
        "class",
        "generic"
      ],
      "type": "MS"
    },
    {
      "question": "Which extra basic type is provided in TS",
      "answers": [
        "enum"
      ],
      "type": "Snippet"
    },
    {
      "question": "What is the most basic type in TS",
      "answers": [
        "boolean"
      ],
      "type": "Snippet"
    },
    {
      "question": "<pre>let isDone = false</pre> <div>What is the type of <pre>isDone</pre></div>",
      "format": "html",
      "answers": [
        "boolean"
      ],
      "type": "Snippet"
    },
    {
      "question": "All numbers in TS are either ${_} or ${_}?",
      "answers": [
        "floating point",
        "bigintegers"
      ],
      type:"FIB"
    },
    {
      "question": "How many basic types are there in TS to represent numbers",
      "answers": [
        2
      ],
      "type": "Snippet"
    },
    {
      "question": "Floating point numbers get which type?",
      "answers": [
        "number"
      ]
    }
  ]
};


function App() {
  return (
    <div className="App">
      <Quiz {...QuizData}/>
    </div>
  );
}

export default App;

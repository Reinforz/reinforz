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
        5,
      ],
      "options": [
        "void",
        "struct",
        "enums",
        "undefined",
        "null",
        "generic",
        "class"
      ],
    },
    // {
    //   "question": "Which extra basic type is provided in TS",
    //   "answers": [
    //     "enum"
    //   ],
    // },
    // {
    //   "question": "What is the most basic type in TS",
    //   "answers": [
    //     "boolean"
    //   ],
    // },
    // {
    //   "question": "<pre>let isDone = false</pre> <div>What is the type of <pre>isDone</pre></div>",
    //   "format": "html",
    //   "answers": [
    //     "boolean"
    //   ],
    // },
    // {
    //   "question": "All numbers in TS are either ${_} or ${_}?",
    //   "answers": [
    //     "floating point",
    //     "bigintegers"
    //   ],
    // },
    // {
    //   "question": "How many basic types are there in TS to represent numbers",
    //   "answers": [
    //     2
    //   ],
    // },
    // {
    //   "question": "Floating point numbers get which type?",
    //   "answers": [
    //     "number"
    //   ]
    // }
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

import React from 'react';
import yaml from 'js-yaml';
import shortid from "shortid"

import shuffle from '../utils/arrayShuffler';

interface UploadProps {
  setQuiz: (data: any) => any,
  currentQuiz: any
}

export default function Upload(props: UploadProps) {
  const { currentQuiz, setQuiz } = props;

  if (!currentQuiz.title)
    fetch("http://localhost:3000/test.yaml").then(data => data.text()).then(data => {
      const QuizData = yaml.safeLoad(data) as any;
      QuizData.questions = shuffle(QuizData.questions);
      QuizData.questions.forEach((question: any) => question._id = shortid())
      setQuiz(QuizData);
    });

  return <div>Upload</div>
}
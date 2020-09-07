import React, { useCallback } from 'react';
import yaml from 'js-yaml';
import shortid from "shortid"
import { useDropzone } from 'react-dropzone'

import shuffle from '../utils/arrayShuffler';

interface UploadProps {
  setQuiz: (data: any) => any,
  currentQuiz: any
}

export default function Upload(props: UploadProps) {
  const { currentQuiz, setQuiz } = props;

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const { result } = reader;
        const QuizData = yaml.safeLoad(result as string) as any;
        QuizData.questions = shuffle(QuizData.questions);
        QuizData.questions.forEach((question: any) => question._id = shortid())
        setQuiz(QuizData);
      }
      reader.readAsText(file)
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}
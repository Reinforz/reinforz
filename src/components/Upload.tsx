import React, { useCallback } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import shortid from "shortid"
import { useDropzone, DropzoneState } from 'react-dropzone'

import shuffle from '../utils/arrayShuffler';

interface UploadProps {
  setQuizzes: (data: any[]) => any,
  currentQuizzes: any[]
}

const getColor = (props: DropzoneState) => {
  if (props.isDragAccept)
    return '#00e676';
  if (props.isDragReject)
    return '#ff1744';
  if (props.isDragActive)
    return '#2196f3';
  return '#404040';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props: DropzoneState) => getColor(props)};
  border-style: solid;
  background-color: #404040;
  color: #bdbdbd;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  outline: none;
  transition: border .24s ease-in-out;
` as any;


export default function Upload(props: UploadProps) {
  const { currentQuizzes, setQuizzes } = props;
  const prepareData = (QuizData: any) => {
    QuizData._id = shortid();
    QuizData.questions = shuffle(QuizData.questions);
    QuizData.questions.forEach((question: any) => question._id = shortid())
  }
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const ext = file.name.split(".")[1];
        const { result } = reader;
        if (result) {
          const QuizData = ext.match(/(yaml|yml)/) ? yaml.safeLoad(result as string) as any : JSON.parse(result.toString());
          const isAdded = currentQuizzes.find((currentQuiz: any) => currentQuiz.title === QuizData.title && currentQuiz.subject === QuizData.subject);
          if (!isAdded) {
            prepareData(QuizData);
            setQuizzes([...currentQuizzes, QuizData]);
          }
        }
      }
      reader.readAsText(file);
    })
  }, [currentQuizzes, setQuizzes]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] })

  return (
    <div className="Upload">
      <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </Container>
      <div>{currentQuizzes.map(currentQuiz => <div key={currentQuiz._id}>
        {currentQuiz.title}
        {currentQuiz.subject}
        {currentQuiz.questions.length}
      </div>)}</div>
    </div>
  )
}
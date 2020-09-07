import React, { useCallback } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import shortid from "shortid"
import { useDropzone, DropzoneState } from 'react-dropzone'

import shuffle from '../utils/arrayShuffler';
import List from "./List";

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

const trimLower = (data: string) => data.replace(/\s/g, '').toLowerCase();

export default function Upload(props: UploadProps) {
  const { currentQuizzes, setQuizzes } = props;
  const prepareData = (QuizData: any) => {
    QuizData._id = shortid();
    QuizData.questions = shuffle(QuizData.questions);
    QuizData.questions.forEach((question: any) => question._id = shortid())
  }
  const onDrop = useCallback(acceptedFiles => {
    let filePromises: Promise<any>[] = [];

    acceptedFiles.forEach((file: File) => {
      let filePromise = new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          const ext = file.name.split(".")[1];
          const { result } = reader;
          if (result) {
            const QuizData = ext.match(/(yaml|yml)/) ? yaml.safeLoad(result as string) as any : JSON.parse(result.toString());
            const isAdded = currentQuizzes.find((currentQuiz: any) => trimLower(currentQuiz.title) === trimLower(QuizData.title) && trimLower(currentQuiz.subject) === trimLower(QuizData.subject));
            if (!isAdded) {
              prepareData(QuizData);
              resolve(QuizData);
            }
          }
        }
        reader.readAsText(file);
      });
      filePromises.push(filePromise)
    });

    Promise.all(filePromises).then(data => {
      setQuizzes([...currentQuizzes, ...data]);
    });
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
      <List setItems={setQuizzes} items={currentQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
    </div>
  )
}
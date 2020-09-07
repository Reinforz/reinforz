import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import shortid from "shortid"
import { useDropzone, DropzoneState } from 'react-dropzone'

import shuffle from '../utils/arrayShuffler';

interface UploadProps {
  setQuiz: (data: any) => any,
  currentQuiz: any
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
  const { currentQuiz, setQuiz } = props;
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const ext = file.name.split(".")[1];
        const { result } = reader;
        if (result) {
          if (ext.match(/(yaml|yml)/)) {
            const QuizData = yaml.safeLoad(result as string) as any;
            QuizData.questions = shuffle(QuizData.questions);
            QuizData.questions.forEach((question: any) => question._id = shortid())
            setQuiz(QuizData);
          } else if (ext === "json") setQuiz(JSON.parse(result.toString()));
        }
      }
      reader.readAsText(file)
    })
  }, [currentQuiz]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] })

  return (
    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </Container>
  )
}
import React, { useCallback } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import shortid from "shortid"
import { useDropzone, DropzoneState } from 'react-dropzone';
import { useSnackbar, OptionsObject } from "notistack";

import { generateQuestionInputConfigs } from '../../../utils/generateConfigs';

import { PlayUploadProps } from '../../../types';

import "./PlayUpload.scss";

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
  border-color: ${(props: DropzoneState) => getColor(props)};
  background-color: #404040;
  color: #bdbdbd;
` as any;

const trimLower = (data: string) => data.replace(/\s/g, '').toLowerCase();
const centerBottomErrorNotistack = {
  variant: 'error',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
} as OptionsObject;

export default function PlayUpload(props: PlayUploadProps) {
  const { items: quizzes, setItems: setQuizzes, setSelectedItems, selectedItems } = props;
  const { enqueueSnackbar } = useSnackbar();
  const prepareData = (QuizData: any) => {
    QuizData._id = shortid();
    QuizData.questions = QuizData.questions.map((question: any) => ({ ...generateQuestionInputConfigs(question), _id: shortid(), subject: QuizData.subject, title: QuizData.title }))
  }
  const onDrop = useCallback(acceptedFiles => {
    let filePromises: Promise<any>[] = [];

    acceptedFiles.forEach((file: File) => {
      let filePromise = new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onabort = () => reject('file reading was aborted');
        reader.onerror = () => reject('file reading has failed');
        reader.onload = () => {
          const ext = file.name.split(".")[1];
          const { result } = reader;
          if (result) {
            const QuizData = ext.match(/(yaml|yml)/) ? yaml.safeLoad(result as string) as any : JSON.parse(result.toString());
            const isAdded = quizzes.find((currentQuiz: any) => trimLower(currentQuiz.title) === trimLower(QuizData.title) && trimLower(currentQuiz.subject) === trimLower(QuizData.subject));
            if ((QuizData?.questions ?? []).length === 0)
              enqueueSnackbar(`${file.name} is has no questions`, centerBottomErrorNotistack);
            else if (isAdded)
              enqueueSnackbar(`${file.name} has already been added`, centerBottomErrorNotistack);
            else {
              prepareData(QuizData);
              resolve(QuizData);
            }
          } else
            enqueueSnackbar(`${file.name} is empty`, centerBottomErrorNotistack);
        }
        reader.readAsText(file);
      });
      filePromises.push(filePromise)
    });

    Promise.all(filePromises).then(data => {
      setQuizzes([...quizzes, ...data]);
      setSelectedItems([...selectedItems, ...data.map(data => data._id)])
    });
  }, [quizzes, setQuizzes, setSelectedItems, enqueueSnackbar, selectedItems]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] })

  return (
    <Container className="PlayUpload" {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files (.json or .yaml files)</p>
      }
    </Container>
  )
}


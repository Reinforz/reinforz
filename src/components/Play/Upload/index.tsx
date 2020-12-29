import React, { useState, useContext } from 'react';
import yaml from 'js-yaml';
import { OptionsObject, useSnackbar } from "notistack";
import { DropzoneState, useDropzone } from 'react-dropzone';
import shortid from "shortid";
import styled from 'styled-components';
import { PlayList, PlayErrorlog, PlayErrorlogsContext, PlayUploadContext } from '..';
import { useThemeSettings } from '../../../hooks';
import { QuestionInputFull, QuizInputFull, QuizInputPartial } from '../../../types';
import { generateQuestionInputConfigs } from '../../../utils';
import "./style.scss";

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
` as any;

const trimLower = (data: string) => data.replace(/\s/g, '').toLowerCase();
const centerBottomErrorNotistack = {
  variant: 'error',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
} as OptionsObject;

export function PlayUpload() {
  const [items, setItems] = useState([] as QuizInputFull[]),
    { enqueueSnackbar } = useSnackbar(),
    { theme } = useThemeSettings(),
    { error_logs, setErrorLogs } = useContext(PlayErrorlogsContext)

  const onDrop = (acceptedFiles: any) => {
    let filePromises: Promise<QuizInputPartial>[] = [];

    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      filePromises.push(new Promise((resolve, reject) => {
        reader.onabort = () => reject('file reading was aborted');
        reader.onerror = () => reject('file reading has failed');
        reader.onload = () => {
          let dot_splitted = file.name.split(".");
          const ext = dot_splitted[dot_splitted.length - 1];
          const { result } = reader;
          if (result) {
            try {
              const QuizData = ext.match(/(yaml|yml)/) ? yaml.safeLoad(result as string) as any : JSON.parse(result.toString());
              const isAdded = items.find((currentQuiz: any) => trimLower(currentQuiz.title) === trimLower(QuizData.title) && trimLower(currentQuiz.subject) === trimLower(QuizData.subject));
              if (isAdded)
                enqueueSnackbar(`${file.name} has already been added`, centerBottomErrorNotistack);
              else
                resolve(QuizData);
            } catch (err) {
              enqueueSnackbar(`${file.name} Error: ${err.message}`, centerBottomErrorNotistack)
            }
          } else
            enqueueSnackbar(`${file.name} is empty`, centerBottomErrorNotistack);
        }
      }));
      reader.readAsText(file);
    });

    Promise.all(filePromises).then(quizzes => {
      const log_messages: PlayErrorlog[] = [];
      const filtered_quizzes: QuizInputFull[] = quizzes.filter((quiz, index) => {
        if (quiz.title && quiz.subject && quiz.questions.length > 0) {
          quiz._id = shortid();
          const generated_questions: QuestionInputFull[] = [];
          quiz.questions.forEach((question, _index) => {
            const [generatedquestion, logs] = generateQuestionInputConfigs(question);
            if (logs.errors.length === 0) {
              generatedquestion.quiz = { subject: quiz.subject, title: quiz.title, _id: quiz._id };
              generated_questions.push(generatedquestion);
            }
            logs.warns.forEach(warn => {
              log_messages.push({ _id: shortid(), level: "WARN", quiz: `${quiz.subject} - ${quiz.title}`, target: `Question ${_index + 1}`, message: warn })
            })
            logs.errors.forEach(error => {
              log_messages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Question ${_index + 1}`, message: error })
            })
          });
          quiz.questions = generated_questions;
          return true
        } else {
          if (!quiz.title)
            log_messages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Quiz ${index + 1}`, message: "Quiz title absent" });
          if (!quiz.subject)
            log_messages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Quiz ${index + 1}`, message: "Quiz subject absent" });
          if (quiz.questions.length <= 0)
            log_messages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, target: `Quiz ${index + 1}`, message: "Quiz must have atleast 1 question" });
          return false
        }
      }) as any;
      setErrorLogs([...error_logs, ...log_messages]);
      setItems([...items, ...filtered_quizzes]);
    });
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] })
  return <PlayUploadContext.Provider value={{ items, setItems }}>
    <Container style={{ backgroundColor: theme.color.light, color: theme.palette.text.secondary }} className="PlayUpload" {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to upload files (.json or .yaml files)</p>
      }
    </Container>
    <PlayList />
  </PlayUploadContext.Provider>
}

export * from "./types";
export * from "./context";


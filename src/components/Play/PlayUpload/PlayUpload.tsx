import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { useDropzone, DropzoneState } from 'react-dropzone';
import { useSnackbar, OptionsObject } from "notistack";
import { useTheme } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import shortid from "shortid"

import { ExtendedTheme, PlayErrorLog, PlayErrorLogState, QuestionInputFull, ISettings, QuizInputPartial } from '../../../types';

import SettingsContext from "../../../context/SettingsContext"

import { generateQuestionInputConfigs } from '../../../utils/generateConfigs';

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
` as any;

const trimLower = (data: string) => data.replace(/\s/g, '').toLowerCase();
const centerBottomErrorNotistack = {
  variant: 'error',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
} as OptionsObject;

export default function PlayUpload(props: { children: any }) {
  const theme = useTheme() as ExtendedTheme;
  const [items, setItems] = useState([] as any[]);
  const { enqueueSnackbar } = useSnackbar();
  const [error_logs, setErrorLogs] = useState([] as PlayErrorLogState);
  const settings = useContext(SettingsContext) as ISettings;
  const new_quizzes: string[] = [];

  const onDrop = (acceptedFiles: any) => {
    let filePromises: Promise<QuizInputPartial>[] = [];

    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      filePromises.push(new Promise((resolve, reject) => {
        reader.onabort = () => reject('file reading was aborted');
        reader.onerror = () => reject('file reading has failed');
        reader.onload = () => {
          const ext = file.name.split(".")[1];
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
      const log_messages: PlayErrorLog[] = [];
      quizzes.forEach(quiz => {
        quiz._id = shortid();
        const generated_questions: QuestionInputFull[] = [];
        quiz.questions.forEach((question, index) => {
          const [generatedquestion, logs] = generateQuestionInputConfigs(question);
          if (logs.errors.length === 0) {
            generatedquestion.quiz = { subject: quiz.subject, title: quiz.title, _id: quiz._id };
            generated_questions.push(generatedquestion);
          }
          logs.warns.forEach(warn => {
            log_messages.push({ _id: shortid(), level: "WARN", quiz: `${quiz.subject} - ${quiz.title}`, question_number: index + 1, message: warn })
          })
          logs.errors.forEach(error => {
            log_messages.push({ _id: shortid(), level: "ERROR", quiz: `${quiz.subject} - ${quiz.title}`, question_number: index + 1, message: error })
          })
        });
        quiz.questions = generated_questions;
        new_quizzes.push(quiz._id)
      });
      setErrorLogs([...error_logs, ...log_messages]);
      setItems([...items, ...quizzes]);
    });
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] })

  return props.children({
    PlayUploadState: {
      items
    },
    PlayUploadComponents: {
      PlayUpload: <Container style={{ backgroundColor: theme.color.light, color: theme.palette.text.secondary }} className="PlayUpload" {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to upload files (.json or .yaml files)</p>
        }
      </Container>,
      PlayErrorLogs: <div className="PlayErrorLogs" style={{ backgroundColor: theme.color.base, color: theme.palette.text.secondary }}>
        <div className="PlayErrorLogs-header" style={{ backgroundColor: theme.color.dark }}>Errors {"&"} Warnings</div>
        <div className="PlayErrorLogs-content" style={{ backgroundColor: theme.color.dark }}>
          {error_logs.length > 0 ? <TransitionGroup component={null}>
            {error_logs.map((error_log, index) => (
              <CSSTransition
                key={error_log._id + index}
                timeout={{
                  enter: (index + 1) * 250,
                  exit: (index + 1) * 250
                }}
                classNames={settings.animation ? "fade" : undefined}
                appear
                style={{ backgroundColor: error_log.level === "ERROR" ? theme.palette.error.main : theme.palette.warning.main, color: theme.palette.text.primary }}
              >
                <div className="PlayErrorLogs-content-item">{error_log.quiz}: Question {error_log.question_number}, {error_log.message}</div></CSSTransition>
            ))}
          </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No Errors or Warnings!</div>}
        </div>
      </div>,
    },
    PlayUploadUtils: {
      setItems,
      removeErrorLogs: (items: any) => {
        const target_quizzes: any = {};
        items.forEach((item: any) => { target_quizzes[`${item.subject} - ${item.title}`] = false });
        setErrorLogs(error_logs.filter(error_log => {
          return target_quizzes[error_log.quiz] === undefined
        }))
      },
    }
  })
}
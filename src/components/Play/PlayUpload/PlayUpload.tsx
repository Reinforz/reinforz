import React, { useState, useCallback, Fragment, useEffect } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { useDropzone, DropzoneState } from 'react-dropzone';
import { useSnackbar, OptionsObject } from "notistack";
import { useTheme } from '@material-ui/core/styles';

import PlayErrorLogs from "../PlayErrorLogs/PlayErrorLogs";


import { PlayUploadProps, ExtendedTheme } from '../../../types';

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



export default function PlayUpload(props: PlayUploadProps) {
  const theme = useTheme() as ExtendedTheme;
  const { items: quizzes, setItems: setQuizzes, setSelectedItems, selectedItems } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    setItems(props.items)
  }, [props.items]);

  const onDrop = useCallback(acceptedFiles => {
    let filePromises: Promise<any>[] = [];

    acceptedFiles.forEach((file: File) => {
      const filePromise = new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onabort = () => reject('file reading was aborted');
        reader.onerror = () => reject('file reading has failed');
        reader.onload = () => {
          const ext = file.name.split(".")[1];
          const { result } = reader;
          if (result) {
            try {
              const QuizData = ext.match(/(yaml|yml)/) ? yaml.safeLoad(result as string) as any : JSON.parse(result.toString());
              const isAdded = quizzes.find((currentQuiz: any) => trimLower(currentQuiz.title) === trimLower(QuizData.title) && trimLower(currentQuiz.subject) === trimLower(QuizData.subject));
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
        reader.readAsText(file);
      });
      filePromises.push(filePromise)
    });

    Promise.all(filePromises).then(data => {
      setItems([...quizzes, ...data]);
    });
  }, [quizzes, enqueueSnackbar]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] })

  return (
    <Fragment>
      <Container style={{ backgroundColor: theme.color.light, color: theme.palette.text.secondary }} className="PlayUpload" {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files (.json or .yaml files)</p>
        }
      </Container>
      <PlayErrorLogs quizzes={items} setQuizzes={setQuizzes} setSelectedItems={setSelectedItems} selectedItems={selectedItems} />
    </Fragment>
  )
}


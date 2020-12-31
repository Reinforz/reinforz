import React, { useState } from 'react';
import yaml from 'js-yaml';
import { OptionsObject, useSnackbar } from "notistack";
import { DropzoneRootProps, useDropzone } from 'react-dropzone';
import shortid from "shortid";
import { PlayList, PlayErrorlogs, PlayUploadContext } from '..';
import { useThemeSettings } from '../../../hooks';
import { QuizInputFull, QuizInputPartial } from '../../../types';
import { generateQuestionInputConfigs } from '../../../utils';
import "./style.scss";

const getColor = (props: DropzoneRootProps) => {
  if (props?.isDragAccept)
    return '#00e676';
  if (props?.isDragReject)
    return '#ff1744';
  if (props?.isDragActive)
    return '#2196f3';
  return '#404040';
}

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
    { theme } = useThemeSettings();

  const onDrop = (acceptedFiles: any) => {
    const filePromises: Promise<QuizInputPartial>[] = [];

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
      setItems([...items, ...quizzes.map(quiz => {
        quiz.questions = quiz.questions.map(generateQuestionInputConfigs);
        if (!quiz._id)
          quiz._id = shortid()
        return quiz as QuizInputFull;
      })]);
    });
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: [".yml", ".yaml", "application/json"] });
  const root_props = getRootProps({ isDragActive, isDragAccept, isDragReject });
  return <PlayUploadContext.Provider value={{ items, setItems }}>
    <div {...root_props} style={{ backgroundColor: theme.color.light, color: theme.palette.text.secondary, borderColor: getColor(root_props) }} className="Play-Upload">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to upload files (.json or .yaml files)</p>
      }
    </div>
    <PlayErrorlogs />
    <PlayList />
  </PlayUploadContext.Provider>
}

export * from "./types";
export * from "./context";


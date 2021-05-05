import yaml from 'js-yaml';
import React from 'react';
import { Upload } from "../../../components/Basic/Upload";
import { IQuizInputFull } from "../../../types";
import "./style.scss";
import { isDuplicate, onResolved } from "./utils";

interface PlayUploadState {
  items: IQuizInputFull[]
  setItems: (quizzes: IQuizInputFull[]) => void
}

export const PlayUploadContext = React.createContext<PlayUploadState>({} as any)

PlayUploadContext.displayName = "PlayUploadContext"

export function PlayUpload() {
  return <Upload loadData={(ext, result) => ext.match(/(yaml|yml)/) ? yaml.safeLoad(result.toString()) as any : JSON.parse(result.toString())} isDuplicate={isDuplicate} onResolved={onResolved}>
    {({ component, state }) =>
      <PlayUploadContext.Provider value={state}>
        {component}
        {/* <PlayErrorlogs /> */}
      </PlayUploadContext.Provider>
    }
  </Upload>
}
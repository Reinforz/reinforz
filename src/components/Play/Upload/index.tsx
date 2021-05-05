import yaml from 'js-yaml';
import React, { useState } from 'react';
import shortid from 'shortid';
import { PlayErrorlogs, PlayUploadContext } from '..';
import { Upload } from "../../../components/Basic/Upload";
import { IQuizInputFull } from '../../../types';
import { generateQuestionInputConfigs } from '../../../utils';
import { trimLower } from '../../../utils/trimLower';
import "./style.scss";

export function PlayUpload() {
  const [items, setItems] = useState<IQuizInputFull[]>([])

  return <PlayUploadContext.Provider value={{ items, setItems }}>
    <Upload items={items} setItems={setItems} loadData={(ext, result) => ext.match(/(yaml|yml)/) ? yaml.safeLoad(result.toString()) as any : JSON.parse(result.toString())} isDuplicate={(items: IQuizInputFull[], loadedData) => items.findIndex((item) => trimLower(item.title) === trimLower(loadedData.title) && trimLower(item.subject) === trimLower(loadedData.subject)) !== -1} onResolved={(currentItems, newItems) => {
      return currentItems.concat(newItems.map(quiz => {
        quiz.questions = quiz.questions.map((question) => generateQuestionInputConfigs(question));
        if (!quiz._id)
          quiz._id = shortid()
        return quiz as IQuizInputFull;
      }))
    }} />
    <PlayErrorlogs />
  </PlayUploadContext.Provider>
}

export * from "./context";
export * from "./types";


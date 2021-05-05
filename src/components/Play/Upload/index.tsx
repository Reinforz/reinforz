import yaml from 'js-yaml';
import React, { useState } from 'react';
import { PlayErrorlogs, PlayUploadContext } from '..';
import { Upload } from "../../../components/Basic/Upload";
import { IQuizInputFull } from '../../../types';
import "./style.scss";
import { isDuplicate, onResolved } from "./utils";

export function PlayUpload() {
  const [items, setItems] = useState<IQuizInputFull[]>([])
  return <PlayUploadContext.Provider value={{ items, setItems }}>
    <Upload items={items} setItems={setItems} loadData={(ext, result) => ext.match(/(yaml|yml)/) ? yaml.safeLoad(result.toString()) as any : JSON.parse(result.toString())} isDuplicate={isDuplicate} onResolved={onResolved} />
    <PlayErrorlogs />
  </PlayUploadContext.Provider>
}

export * from "./context";
export * from "./types";


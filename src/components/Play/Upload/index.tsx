import yaml from 'js-yaml';
import React from 'react';
import { PlayErrorlogs, PlayUploadContext } from '..';
import { Upload } from "../../../components/Basic/Upload";
import "./style.scss";
import { isDuplicate, onResolved } from "./utils";

export function PlayUpload() {
  return <Upload loadData={(ext, result) => ext.match(/(yaml|yml)/) ? yaml.safeLoad(result.toString()) as any : JSON.parse(result.toString())} isDuplicate={isDuplicate} onResolved={onResolved}>
    {({ component, state }) =>
      <PlayUploadContext.Provider value={state}>
        {component}
        <PlayErrorlogs />
      </PlayUploadContext.Provider>
    }
  </Upload>
}

export * from "./context";
export * from "./types";


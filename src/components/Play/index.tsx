import React, { useState } from "react";
import { PlayContext } from "./context";
import { PlayUpload } from "../";

import "./style.scss";

export function Play() {
  const [playing, setPlaying] = useState(false);
  return <div className="Play">
    <PlayContext.Provider value={{ playing, setPlaying }}>
      <PlayUpload />
    </PlayContext.Provider>
  </div>
}

export * from "./Settings"
export * from "./Table"
export * from "./List"
export * from "./Upload"
export * from "./Errorlogs"
export * from "./types"
export * from "./context"
import React, { useState } from "react";
import { PlayUpload } from "../";
import "./style.scss";

interface PlayState {
  playing: boolean,
  setPlaying: (playing: boolean) => void
}

export const PlayContext = React.createContext<PlayState>({} as any)
PlayContext.displayName = "PlayContext"

export function Play() {
  const [playing, setPlaying] = useState(false);
  return <div className="Play">
    <PlayContext.Provider value={{ playing, setPlaying }}>
      <PlayUpload />
    </PlayContext.Provider>
  </div>
}

export * from "./Upload";
// export * from "./Settings"
// export * from "./Table"
// export * from "./List"
// export * from "./Errorlogs"
// export * from "./types"
// export * from "./context"
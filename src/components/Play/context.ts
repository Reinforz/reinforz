import React from "react";

import { PlayState } from "./types";

export const PlayContext = React.createContext<PlayState>({} as any)
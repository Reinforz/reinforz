import React from "react";

import { PlayErrorlogsContextValue } from "./types";

export const PlayErrorlogsContext = React.createContext<PlayErrorlogsContextValue>({} as any)
PlayErrorlogsContext.displayName = "PlayErrorLogsContext"
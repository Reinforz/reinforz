import React from "react";
import { ListState } from "../../Basic/List/types";

export const PlayListContext = React.createContext<ListState>({} as any)
PlayListContext.displayName = "PlayListContext"
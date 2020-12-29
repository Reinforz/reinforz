import React, { useState } from "react";
// @ts-ignore
import { PlayContext } from "./context";
import {
  MenuRenderProps,
  PlayUploadRenderProps
} from "../../types";

import { PlayErrorlogs } from "../";

import "./style.scss";

/* const renderPlayMenu = ({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }: { ListRenderProps: ListRenderProps, PlayUploadRenderProps: PlayUploadRenderProps, IPlaySettingsRenderProps: IPlaySettingsRenderProps }) => {
  const { PlaySettingsComponent } = IPlaySettingsRenderProps;
  return <div className="Play" id="Play">
    <Menu content={PlaySettingsComponent} lskey="Play_menu">
      {(MenuRenderProps: MenuRenderProps) =>
        <Fragment>
          {MenuRenderProps.MenuComponent}
          <PlayContent renderprops={{ ListRenderProps, PlayUploadRenderProps, MenuRenderProps }} />
        </Fragment>
      }
    </Menu>
  </div>
} */

export function Play() {
  const [playing, setPlaying] = useState(false);
  return <PlayContext.Provider value={{ playing, setPlaying }}>
    <PlayErrorlogs />
  </PlayContext.Provider>
}

export * from "./Settings"
export * from "./Table"
export * from "./List"
export * from "./Upload"
export * from "./Errorlogs"
export * from "./types"
export * from "./context"
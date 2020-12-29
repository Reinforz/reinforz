// @ts-ignore
import debounced from 'just-debounce';
import React, { Fragment, useState } from "react";
import { FcSettings } from "react-icons/fc";
import { useHistory } from "react-router-dom";
import SplitPane from 'react-split-pane';
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';
import { PlayContext } from "./context";
import {
  MenuRenderProps,
  PlayUploadRenderProps
} from "../../types";

import { Icon } from '../Basic';
import Menu from "../Basic/Menu";
import View from '../Basic/View';

import { PlayErrorlogs } from "../";

import "./style.scss";

let prev_pane_size = localStorage.getItem("Play_pane_size");

const setToLs = debounced((size: string) => {
  localStorage.setItem("Play_pane_size", size || "50%")
}, 2500)

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

/* const PlayContent = (props: { renderprops: { ListRenderProps: ListRenderProps, PlayUploadRenderProps: PlayUploadRenderProps, MenuRenderProps: MenuRenderProps } }) => {
  const history = useHistory(), { theme, settings, sounds } = useThemeSettings();

  const { ListRenderProps, PlayUploadRenderProps, MenuRenderProps } = props.renderprops;
  const { ListComponent } = ListRenderProps;
  const { PlayUploadComponents, PlayUploadState } = PlayUploadRenderProps;
  const { MenuExtra } = MenuRenderProps;

  return <div className="Play-content" id="Play-content" style={{ ...MenuExtra.content_elem_style }}>
    <Icon popoverText="Click to go to settings page">
      <FcSettings className="App-icon App-icon--settings" onClick={() => {
        if (settings.sound) sounds.swoosh.play()
        history.push("/settings")
      }} />
    </Icon>
    <SplitPane split="vertical" onChange={(size: any) => {
      setToLs(size[0])
    }}>
      <Pane initialSize={prev_pane_size || "50%"} minSize="30%" maxSize="70%" className="Play-pane">
        {PlayUploadComponents.PlayUpload}
        <View lskey="PlayLists">
          {({ ViewComponent, ViewExtra }: any) =>
            <div {...ViewExtra.ViewContainerProps}>
              {[PlayUploadComponents.PlayErrorLogs, ListComponent].map((comp, index) => <div key={index} style={ViewExtra.ViewComponentsStyle[index]}>{comp}</div>)}
              {ViewComponent}
            </div>
          }
        </View>
        <div className="Help" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Need help, <a style={{ color: theme.palette.text.secondary }} href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
      </Pane>
      <PlayTable quizzes={PlayUploadState.items} />
    </SplitPane>
  </div>
} */

export function Play() {
  const [playing, setPlaying] = useState(false);
  return <PlayContext.Provider value={{ playing, setPlaying }}>
    <PlayErrorlogs />
  </PlayContext.Provider>
}

export * from "./Settings"
// export * from "./Table"
export * from "./List"
export * from "./Upload"
export * from "./Errorlogs"
export * from "./types"
export * from "./context"
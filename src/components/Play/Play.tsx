import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { FcSettings } from "react-icons/fc";
import SplitPane from 'react-split-pane';
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';
// @ts-ignore
import debounced from 'just-debounce'

import PlayUpload from "./PlayUpload/PlayUpload";
import Quiz from "../Quiz/Quiz";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import List from "../Basic/List/List";
import Icon from '../Basic/Icon';
import View from '../Basic/View';
import Menu from "../Basic/Menu";

import PlayContext from "../../context/PlayContext"

import useThemeSettings from "../../hooks/useThemeSettings";

import {
  IPlaySettingsRProps,
  ListRProps,
  MenuRProps,
  PlayUploadRProps,
} from "../../types";

import "./Play.scss";

let prev_pane_size = localStorage.getItem("Play_pane_size");

const setToLs = debounced((size: string) => {
  localStorage.setItem("Play_pane_size", size || "50%")
}, 2500)

interface IPlayState {
  playing: boolean
}

interface IPlayUtils {
  setPlaying: (playing: boolean) => void
}

interface IPlayRProps {
  PlayState: IPlayState,
  PlayUtils: IPlayUtils
}

const renderPlayUpload = (PlayRenderProps: IPlayRProps) =>
  <PlayUpload>
    {(PlayUploadRenderProps: PlayUploadRProps) =>
      renderList({ PlayUploadRenderProps, PlayRenderProps })
    }
  </PlayUpload>

const renderList = ({ PlayUploadRenderProps, PlayRenderProps }: { PlayRenderProps: IPlayRProps, PlayUploadRenderProps: PlayUploadRProps }) => {
  const { PlayUploadState, PlayUploadUtils } = PlayUploadRenderProps;
  return <List header="Uploaded Quizzes" items={PlayUploadState.items} setItems={PlayUploadUtils.setItems} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} onDelete={PlayUploadUtils.removeErrorLogs}>
    {(ListRenderProps: ListRProps) =>
      renderPlaySettings({ ListRenderProps, PlayUploadRenderProps, PlayRenderProps })
    }
  </List>
}

const renderPlaySettings = ({ ListRenderProps, PlayUploadRenderProps, PlayRenderProps }: { PlayRenderProps: IPlayRProps, ListRenderProps: ListRProps, PlayUploadRenderProps: PlayUploadRProps }) => {
  const { ListState, ListUtils } = ListRenderProps;
  const { PlayUploadState, PlayUploadUtils } = PlayUploadRenderProps;
  const { PlayState: { playing }, PlayUtils: { setPlaying } } = PlayRenderProps;
  return <PlaySettings quizzes={PlayUploadState.items} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
    {(IPlaySettingsRenderProps: IPlaySettingsRProps) => {
      const { PlaySettingsState, PlaySettingsExtra } = IPlaySettingsRenderProps;
      if (playing)
        localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
      return playing ?
        <PlayContext.Provider value={{ setQuizzes: PlayUploadUtils.setItems, setPlaying, setSelected: ListUtils.setSelectedItems }}>
          <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
        </PlayContext.Provider> : renderPlayMenu({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps })
    }}
  </PlaySettings>
}

const renderPlayMenu = ({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }: { ListRenderProps: ListRProps, PlayUploadRenderProps: PlayUploadRProps, IPlaySettingsRenderProps: IPlaySettingsRProps }) => {
  const { PlaySettingsComponent } = IPlaySettingsRenderProps;
  return <div className="Play" id="Play">
    <Menu content={PlaySettingsComponent} lskey="Play_menu">
      {(MenuRenderProps: MenuRProps) =>
        <Fragment>
          {MenuRenderProps.MenuComponent}
          <PlayContent renderprops={{ ListRenderProps, PlayUploadRenderProps, MenuRenderProps }} />
        </Fragment>
      }
    </Menu>
  </div>
}

const PlayContent = (props: { renderprops: { ListRenderProps: ListRProps, PlayUploadRenderProps: PlayUploadRProps, MenuRenderProps: MenuRProps } }) => {
  const { ListRenderProps, PlayUploadRenderProps, MenuRenderProps } = props.renderprops;
  const history = useHistory();
  const { theme, settings, sounds } = useThemeSettings();
  const { ListComponent } = ListRenderProps;
  const { PlayUploadComponents, PlayUploadState } = PlayUploadRenderProps;
  const { MenuExtra } = MenuRenderProps;

  return <div className="Play-content" id="Play-content" style={{ ...MenuExtra.content_elem_style }}>
    <Fragment>
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

    </Fragment>
  </div>
}

function Play() {
  const [playing, setPlaying] = useState(false);

  return renderPlayUpload({
    PlayUtils: { setPlaying },
    PlayState: { playing }
  });
}

export default Play;
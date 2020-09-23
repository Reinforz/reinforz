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
import List from "../Basic/List";
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

const swoosh = new Audio(process.env.PUBLIC_URL + "/sounds/swoosh.mp3");
swoosh.volume = 0.25;

let prev_pane_size = localStorage.getItem("Play_pane_size");

const setToLs = debounced((size: string) => {
  localStorage.setItem("Play_pane_size", size || "50%")
}, 2500)

function Play() {
  const [playing, setPlaying] = useState(false);
  const history = useHistory();
  const { theme, settings } = useThemeSettings();

  return (
    <PlayUpload>
      {({ PlayUploadState, PlayUploadComponents, PlayUploadUtils }: PlayUploadRProps) => {
        return <List header="Uploaded Quizzes" items={PlayUploadState.items} setItems={PlayUploadUtils.setItems} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} onDelete={PlayUploadUtils.removeErrorLogs}>
          {({ ListComponent, ListState, ListUtils }: ListRProps) => {
            return <PlaySettings quizzes={PlayUploadState.items} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
              {({ PlaySettingsComponent, PlaySettingsState, PlaySettingsExtra }: IPlaySettingsRProps) => {
                if (playing)
                  localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
                return <Fragment>
                  {playing ?
                    <PlayContext.Provider value={{ setQuizzes: PlayUploadUtils.setItems, setPlaying, setSelected: ListUtils.setSelectedItems }}>
                      <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
                    </PlayContext.Provider> :
                    <div className="Play" id="Play">
                      <Icon onClick={() => {
                        if (settings.sound) swoosh.play()
                        history.push("/settings")
                      }} icon={FcSettings} popoverText="Click to go to settings page" className="App-icon App-icon--settings" />
                      <Menu content={PlaySettingsComponent} lskey="Play_menu">
                        {({ MenuComponent, MenuExtra }: MenuRProps) => {
                          return <Fragment>
                            {MenuComponent}
                            <div className="Play-content" id="Play-content" style={{ ...MenuExtra.content_elem_style }}>
                              <SplitPane split="vertical" onChange={(size: any) => {
                                setToLs(size[0])
                              }}>
                                <Pane initialSize={prev_pane_size || "50%"} minSize="30%" maxSize="70%" className="Play-pane">
                                  {PlayUploadComponents.PlayUpload}
                                  <View items={[PlayUploadComponents.PlayErrorLogs, ListComponent]} />
                                  <div className="Help" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Need help, <a style={{ color: theme.palette.text.secondary }} href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
                                </Pane>
                                <PlayTable quizzes={PlayUploadState.items} />
                              </SplitPane>
                            </div>
                          </Fragment>
                        }}
                      </Menu>
                    </div>
                  }
                </Fragment>
              }}
            </PlaySettings>
          }}
        </List>
      }}
    </PlayUpload >
  );
}

export default Play;
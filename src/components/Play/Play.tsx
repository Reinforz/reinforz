import React, { useState, Fragment, useContext } from "react";
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { FcSettings } from "react-icons/fc";

import PlayUpload from "./PlayUpload/PlayUpload";
import Quiz from "../Quiz/Quiz";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import List from "../Basic/List";
import Icon from '../Basic/Icon';
import View from '../Basic/View';

import PlayContext from "../../context/PlayContext"

import SettingsContext from "../../context/SettingsContext";

import {
  IPlaySettingsRProps,
  ListRProps,
  ExtendedTheme,
  ISettings,
  PlayUploadRProps,
} from "../../types";

import "./Play.scss";

const swoosh = new Audio(process.env.PUBLIC_URL + "/sounds/swoosh.mp3");
swoosh.volume = 0.25;

function Play() {
  const [playing, setPlaying] = useState(false);
  const theme = useTheme() as ExtendedTheme;
  const history = useHistory();
  const settings = useContext(SettingsContext) as ISettings;
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
                    <div className="Play">
                      <Icon onClick={() => {
                        if (settings.sound) swoosh.play()
                        history.push("/settings")
                      }} icon={FcSettings} popoverText="Click to go to settings page" className="App-icon App-icon--settings" />
                      <PlayTable quizzes={PlayUploadState.items} />
                      {PlayUploadComponents.PlayUpload}
                      <View items={[PlayUploadComponents.PlayErrorLogs, ListComponent]} />
                      {PlaySettingsComponent}
                      <div className="Help" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Need help, <a style={{ color: theme.palette.text.secondary }} href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
                    </div>
                  }
                </Fragment>
              }}
            </PlaySettings>
          }}
        </List>
      }}
    </PlayUpload>
  );
}

export default Play;
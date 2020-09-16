import React, { useState, Fragment, useContext } from "react";
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { FcSettings } from "react-icons/fc";
import useSound from "use-sound";

import PlayUpload from "./PlayUpload/PlayUpload";
import Quiz from "../Quiz/Quiz";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import List from "../Basic/List";
import Icon from '../Basic/Icon';

import PlayContext from "../../context/PlayContext"

import SettingsContext from "../../context/SettingsContext";

import {
  IPlaySettingsRProps,
  ListRProps,
  ExtendedTheme,
  ISettings
} from "../../types";

import "./Play.scss";


function Play() {
  const [playing, setPlaying] = useState(false);
  const [quizzes, setQuizzes] = useState([] as any[]);
  const theme = useTheme() as ExtendedTheme;
  const history = useHistory();
  const settings = useContext(SettingsContext) as ISettings;
  const [swoosh] = useSound(process.env.PUBLIC_URL + "/sounds/swoosh.mp3", { volume: 0.25 });

  return (
    <List header="Uploaded Quizzes" items={quizzes} setItems={setQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
      {({ ListComponent, ListState, ListUtils }: ListRProps) => {
        return <PlaySettings quizzes={quizzes} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
          {({ PlaySettingsComponent, PlaySettingsState, PlaySettingsExtra }: IPlaySettingsRProps) => {
            if (playing)
              localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
            return <Fragment>
              {playing ?
                <PlayContext.Provider value={{ setQuizzes, setPlaying, setSelected: ListUtils.setSelectedItems }}>
                  <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
                </PlayContext.Provider> :
                <div className="Play">
                  <Icon onClick={() => {
                    if (settings.sound) swoosh()
                    history.push("/settings")
                  }} icon={FcSettings} popoverText="Click to go to settings page" className="App-icon App-icon--settings" />
                  <PlayTable quizzes={quizzes} />
                  <PlayUpload selectedItems={ListState.selectedItems} setSelectedItems={ListUtils.setSelectedItems} setItems={setQuizzes} items={quizzes} />
                  {ListComponent}
                  {PlaySettingsComponent}
                  <div className="Help" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Need help, <a style={{ color: theme.palette.text.secondary }} href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
                </div>
              }
            </Fragment>
          }}
        </PlaySettings>
      }}
    </List>
  );
}

export default Play;
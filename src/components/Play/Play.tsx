import React, { useState, Fragment } from "react";
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { FcSettings } from "react-icons/fc";

import PlayUpload from "./PlayUpload/PlayUpload";
import Quiz from "../Quiz/Quiz";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import List from "../Basic/List";
import PlayErrorLogs from "./PlayErrorLogs/PlayErrorLogs";
import Icon from '../Basic/Icon';


import {
  IPlaySettingsRProps,
  ListRProps,
  ExtendedTheme
} from "../../types";

import "./Play.scss";


function Play() {
  const [playing, setPlaying] = useState(false);
  const [quizzes, setQuizzes] = useState([] as any[]);
  const theme = useTheme() as ExtendedTheme;
  const history = useHistory();

  return (
    <List header="Uploaded Quizzes" items={quizzes} setItems={setQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
      {({ ListComponent, ListState, ListUtils }: ListRProps) => {
        return <PlaySettings quizzes={quizzes} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
          {({ PlaySettingsComponent, PlaySettingsState, PlaySettingsExtra }: IPlaySettingsRProps) => {
            if (playing)
              localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
            return <Fragment>
              {playing ?
                <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} /> :
                <div className="Play">
                  <Icon onClick={() => { history.push("/settings") }} icon={FcSettings} popoverText="Click to go to settings page" className="App-icon App-icon--settings" />
                  <PlayTable quizzes={quizzes} />
                  <PlayErrorLogs quizzes={quizzes} />
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
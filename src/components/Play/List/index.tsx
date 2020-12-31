import React, { useContext } from "react";
import { PlaySettings, PlayListContext } from "..";
import List from "../../Basic/List";
import { PlayErrorlogsContext } from "../Errorlogs";

import "./style.scss";

export const PlayList = () => {
  const { correct_quizzes } = useContext(PlayErrorlogsContext);
  return <List className="Play-List" header="Uploaded Quizzes" items={correct_quizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
    {({ selected_items, selectItems }) => <PlayListContext.Provider value={{ selected_items, selectItems }}><PlaySettings /></PlayListContext.Provider>}
  </List>
}

export * from "./types";
export * from "./context";

// const { PlaySettingsState, PlaySettingsExtra } = IPlaySettingsRenderProps;
// if (playing)
//   localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
// return playing ? <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
//   : /* renderPlayMenu({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }) */ null
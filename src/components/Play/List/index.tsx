import React, { useContext } from "react";
import { PlaySettings, PlayUploadContext, PlayListContext } from "..";
import List, { ListState } from "../../Basic/List";

import "./style.scss";

export const PlayList = () => {
  const { items, setItems } = useContext(PlayUploadContext);
  return <List className="Play-List" header="Uploaded Quizzes" items={items} setItems={setItems} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
    {({ selectedItems, setSelectedItems }: ListState) => <PlayListContext.Provider value={{ selectedItems, setSelectedItems }}><PlaySettings /></PlayListContext.Provider>}
  </List>
}

export * from "./types";
export * from "./context";

// const { PlaySettingsState, PlaySettingsExtra } = IPlaySettingsRenderProps;
// if (playing)
//   localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
// return playing ? <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
//   : /* renderPlayMenu({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }) */ null
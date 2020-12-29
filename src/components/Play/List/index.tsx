import React, { useContext } from "react";
import { PlayContext } from "../../../context";
import List from "../../Basic/List/List";

export const PlayList = () => {
  const { playing } = useContext(PlayContext);
  return <div>{playing}</div>
  // return <List header="Uploaded Quizzes" items={items} setItems={setItems} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} onDelete={PlayUploadUtils.removeErrorLogs}>
  //   {(ListRenderProps) => {
  //     return ListRenderProps.List
  //     // return <PlaySettings quizzes={items} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
  //     //   {(IPlaySettingsRenderProps: IPlaySettingsRenderProps) => {
  //     //     const { PlaySettingsState, PlaySettingsExtra } = IPlaySettingsRenderProps;
  //     //     // if (playing)
  //     //     //   localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
  //     //     // return playing ? <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
  //     //     //   : /* renderPlayMenu({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }) */ null
  //     //   }}
  //     // </PlaySettings>
  //   }}
  // </List>
}

export * from "./types";
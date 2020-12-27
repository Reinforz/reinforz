import React, { useContext } from "react";
import { PlaySettings, Quiz } from "../..";
import { PlayContext, PlayUploadContext, PlaySettingsContext } from "../../../context";
import List from "../../Basic/List/List";

export const PlayList = () => {
  const { items, setItems } = useContext(PlayUploadContext),
    { playing } = useContext(PlayContext),
    { play_settings } = useContext(PlaySettingsContext);

  return <List header="Uploaded Quizzes" items={items} setItems={setItems} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} onDelete={PlayUploadUtils.removeErrorLogs}>
    {(ListRenderProps: ListRenderProps) => {
      const { ListState } = ListRenderProps;
      return <PlaySettings quizzes={items} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
        {(IPlaySettingsRenderProps: IPlaySettingsRenderProps) => {
          const { PlaySettingsState, PlaySettingsExtra } = IPlaySettingsRenderProps;
          if (playing)
            localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
          return playing ? <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
            : /* renderPlayMenu({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }) */ null
        }}
      </PlaySettings>
    }}
  </List>
}

export * from "./types";
import React, { useState } from "react";
import { List } from "../../shared";
import {
  IPlaySettingsFiltersState,
  IPlaySettingsOptionsState,
  PlayErrorLog,
  QuizInputFull
} from "../../types";
import "./Play.scss";
import PlayErrorlogs from "./PlayErrorlogs/PlayErrorlogs";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayUpload from "./PlayUpload/PlayUpload";

// const renderPlaySettings = ({ ListRenderProps, PlayUploadRenderProps, PlayRenderProps }: { PlayRenderProps: IPlayRProps, ListRenderProps: ListRProps, PlayUploadRenderProps: PlayUploadRProps }) => {
//   const { ListState, ListUtils } = ListRenderProps;
//   const { PlayUploadState, PlayUploadUtils } = PlayUploadRenderProps;
//   const { PlayState: { playing }, PlayUtils: { setPlaying } } = PlayRenderProps;
//   return <PlaySettings quizzes={PlayUploadState.items} setPlaying={setPlaying} selectedQuizzes={ListState.selectedItems}>
//     {(IPlaySettingsRenderProps: IPlaySettingsRProps) => {
//       const { PlaySettingsState, PlaySettingsExtra } = IPlaySettingsRenderProps;
//       if (playing)
//         localStorage.setItem('PLAY_SETTINGS', JSON.stringify(PlaySettingsState))
//       return playing ?
//         <PlayContext.Provider value={{ setQuizzes: PlayUploadUtils.setItems, setPlaying, setSelected: ListUtils.setSelectedItems }}>
//           <Quiz selected_quizzes={PlaySettingsExtra.selected_quizzes} play_options={PlaySettingsState.play_options} all_questions={PlaySettingsExtra.filtered_questions} />
//         </PlayContext.Provider> : renderPlayMenu({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps })
//     }}
//   </PlaySettings>
// }

// const renderPlayMenu = ({ ListRenderProps, PlayUploadRenderProps, IPlaySettingsRenderProps }: { ListRenderProps: ListRProps, PlayUploadRenderProps: PlayUploadRProps, IPlaySettingsRenderProps: IPlaySettingsRProps }) => {
//   const { PlaySettingsComponent } = IPlaySettingsRenderProps;
//   return <div className="Play" id="Play">
//     <Menu content={PlaySettingsComponent} lskey="Play_menu">
//       {(MenuRenderProps: MenuRProps) =>
//         <Fragment>
//           {MenuRenderProps.MenuComponent}
//           <PlayContent renderprops={{ ListRenderProps, PlayUploadRenderProps, MenuRenderProps }} />
//         </Fragment>
//       }
//     </Menu>
//   </div>
// }

// const PlayContent = (props: { renderprops: { ListRenderProps: ListRProps, PlayUploadRenderProps: PlayUploadRProps, MenuRenderProps: MenuRProps } }) => {
//   const { ListRenderProps, PlayUploadRenderProps, MenuRenderProps } = props.renderprops;
//   const history = useHistory();
//   const { theme, settings, sounds } = useThemeSettings();
//   const { ListComponent } = ListRenderProps;
//   const { PlayUploadComponents, PlayUploadState } = PlayUploadRenderProps;
//   const { MenuExtra } = MenuRenderProps;

//   return <div className="Play-content" id="Play-content" style={{ ...MenuExtra.content_elem_style }}>
//     <Fragment>
//       <Icon popoverText="Click to go to settings page">
//         <FcSettings className="App-icon App-icon--settings" onClick={() => {
//           if (settings.sound) sounds.swoosh.play()
//           history.push("/settings")
//         }} />
//       </Icon>
//       <SplitPane defaultSize={prev_pane_size || "50%"} minSize="30%" maxSize="70%" split="vertical" onChange={(size: any) => {
//         setToLs(size[0])
//       }}>
//         <div className="Play-pane">
//           {PlayUploadComponents.PlayUpload}
//           <View lskey="PlayLists">
//             {({ ViewComponent, ViewExtra }: any) =>
//               <div {...ViewExtra.ViewContainerProps}>
//                 {[PlayUploadComponents.PlayErrorLogs, ListComponent].map((comp, index) => <div key={index} style={ViewExtra.ViewComponentsStyle[index]}>{comp}</div>)}
//                 {ViewComponent}
//               </div>
//             }
//           </View>
//           <div className="Help" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Need help, <a style={{ color: theme.palette.text.secondary }} href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
//         </div>
//         <PlayTable quizzes={PlayUploadState.items} />
//       </SplitPane>
//     </Fragment>
//   </div>
// }

const DEFAULT_PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState,
  DEFAULT_PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState;

export interface IPlaySettings {
  options: IPlaySettingsOptionsState,
  filters: IPlaySettingsFiltersState
}
interface IPlayContext {
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  uploadedQuizzes: QuizInputFull[],
  setUploadedQuizzes: React.Dispatch<React.SetStateAction<QuizInputFull[]>>
  selectedQuizzes: string[],
  setSelectedQuizzes: React.Dispatch<React.SetStateAction<string[]>>
  errorLogs: PlayErrorLog[],
  setErrorLogs: React.Dispatch<React.SetStateAction<PlayErrorLog[]>>
  playSettings: IPlaySettings
  setPlaySettings: React.Dispatch<React.SetStateAction<IPlaySettings>>
}

export const PlayContext = React.createContext({} as IPlayContext)

function Play() {
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;

  const [playSettings, setPlaySettings] = useState<IPlaySettings>({
    options: PLAY_SETTINGS ? PLAY_SETTINGS.play_options : DEFAULT_PLAY_OPTIONS_STATE,
    filters: PLAY_SETTINGS ? PLAY_SETTINGS.play_filters : DEFAULT_PLAY_FILTERS_STATE
  });

  const [playing, setPlaying] = useState(false);
  const [uploadedQuizzes, setUploadedQuizzes] = useState<QuizInputFull[]>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const [errorLogs, setErrorLogs] = useState<PlayErrorLog[]>([]);

  return <div className="Play">
    <PlayContext.Provider value={{ setPlaySettings, playSettings, errorLogs, setErrorLogs, setPlaying, playing, uploadedQuizzes, selectedQuizzes, setUploadedQuizzes, setSelectedQuizzes }}>
      <PlayUpload />
      <PlayErrorlogs />
      <List selectedItems={selectedQuizzes} setSelectedItems={setSelectedQuizzes} header="Uploaded Quizzes" items={uploadedQuizzes} setItems={setUploadedQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
      <PlaySettings />
    </PlayContext.Provider>
  </div>
}

export default Play;
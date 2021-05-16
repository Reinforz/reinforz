import React, { useState } from "react";
import { QUIZ_1 } from "../../data/quiz1";
import { List } from "../../shared";
import {
  IPlaySettings,
  IPlaySettingsFiltersState,
  IPlaySettingsOptionsState,
  PlayErrorLog,
  QuizInputFull
} from "../../types";
import shuffle from "../../utils/arrayShuffler";
import "./Play.scss";
import PlayErrorlogs from "./PlayErrorlogs/PlayErrorlogs";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import PlayUpload from "./PlayUpload/PlayUpload";

const DEFAULT_PLAY_OPTIONS_STATE = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false, partial_score: true } as IPlaySettingsOptionsState,
  DEFAULT_PLAY_FILTERS_STATE = { time_allocated: [15, 60], excluded_difficulty: [], excluded_types: [] } as IPlaySettingsFiltersState;

interface IPlayContext {
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  uploadedQuizzes: QuizInputFull[],
  setUploadedQuizzes: React.Dispatch<React.SetStateAction<QuizInputFull[]>>
  selectedQuizzes: string[],
  setSelectedQuizzes: React.Dispatch<React.SetStateAction<string[]>>
  filteredQuizzes: QuizInputFull[],
  errorLogs: PlayErrorLog[],
  setErrorLogs: React.Dispatch<React.SetStateAction<PlayErrorLog[]>>
  playSettings: IPlaySettings
  setPlaySettings: React.Dispatch<React.SetStateAction<IPlaySettings>>
}

const quizzes = [
  QUIZ_1
];

export const PlayContext = React.createContext({} as IPlayContext)

function Play() {
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;

  const [playSettings, setPlaySettings] = useState<IPlaySettings>({
    options: PLAY_SETTINGS ? PLAY_SETTINGS.play_options : DEFAULT_PLAY_OPTIONS_STATE,
    filters: PLAY_SETTINGS ? PLAY_SETTINGS.play_filters : DEFAULT_PLAY_FILTERS_STATE
  });

  const [playing, setPlaying] = useState(false);
  const [uploadedQuizzes, setUploadedQuizzes] = useState<QuizInputFull[]>(quizzes);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([QUIZ_1._id]);
  const [errorLogs, setErrorLogs] = useState<PlayErrorLog[]>([]);

  let filteredQuizzes = uploadedQuizzes.filter(quiz => selectedQuizzes.includes(quiz._id));

  if (playSettings.options.shuffle_quizzes && !playSettings.options.flatten_mix) filteredQuizzes = shuffle(filteredQuizzes);
  if (playSettings.options.shuffle_questions && !playSettings.options.flatten_mix) filteredQuizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
  filteredQuizzes.forEach(filteredQuiz => {
    filteredQuiz.questions = filteredQuiz.questions.filter(question => !playSettings.filters.excluded_difficulty.includes(question.difficulty) && !playSettings.filters.excluded_types.includes(question.type) && playSettings.filters.time_allocated[0] <= question.time_allocated && playSettings.filters.time_allocated[1] >= question.time_allocated);
  });

  return <div className="Play">
    <PlayContext.Provider value={{ filteredQuizzes, setPlaySettings, playSettings, errorLogs, setErrorLogs, setPlaying, playing, uploadedQuizzes, selectedQuizzes, setUploadedQuizzes, setSelectedQuizzes }}>
      {!playing ? <>
        <PlayUpload />
        <PlayErrorlogs />
        <List selectedItems={selectedQuizzes} setSelectedItems={setSelectedQuizzes} header="Uploaded Quizzes" items={uploadedQuizzes} setItems={setUploadedQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
        <PlaySettings />
        <PlayTable />
      </> : null}
    </PlayContext.Provider>
  </div>
}

export default Play;
import React, { useState } from "react";
import { QUIZ_1 } from "../../data/quiz1";
import { List } from "../../shared";
import {
  IErrorLog, IPlaySettings, IQuizFull, TQuestionFull
} from "../../types";
import { createDefaultPlaySettingsFiltersState, createDefaultPlaySettingsOptionsState } from "../../utils";
import shuffle from "../../utils/arrayShuffler";
import Quiz from "../Quiz/Quiz";
import "./Play.scss";
import PlayErrorlogs from "./PlayErrorlogs/PlayErrorlogs";
import PlaySettings from "./PlaySettings/PlaySettings";
import PlayTable from "./PlayTable/PlayTable";
import PlayUpload from "./PlayUpload/PlayUpload";

interface IPlayContext {
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  uploadedQuizzes: IQuizFull[],
  setUploadedQuizzes: React.Dispatch<React.SetStateAction<IQuizFull[]>>
  selectedQuizzes: string[],
  setSelectedQuizzes: React.Dispatch<React.SetStateAction<string[]>>
  filteredQuizzes: IQuizFull[],
  errorLogs: IErrorLog[],
  setErrorLogs: React.Dispatch<React.SetStateAction<IErrorLog[]>>
  playSettings: IPlaySettings
  setPlaySettings: React.Dispatch<React.SetStateAction<IPlaySettings>>
  allQuestions: TQuestionFull[]
}

const quizzes = [
  QUIZ_1
];

export const PlayContext = React.createContext({} as IPlayContext)

function Play() {
  let PLAY_SETTINGS: any = localStorage.getItem('PLAY_SETTINGS');
  PLAY_SETTINGS = PLAY_SETTINGS ? JSON.parse(PLAY_SETTINGS) : undefined;

  const [playSettings, setPlaySettings] = useState<IPlaySettings>({
    options: PLAY_SETTINGS ? PLAY_SETTINGS.play_options : createDefaultPlaySettingsOptionsState(),
    filters: PLAY_SETTINGS ? PLAY_SETTINGS.play_filters : createDefaultPlaySettingsFiltersState()
  });

  const [playing, setPlaying] = useState(true);
  const [uploadedQuizzes, setUploadedQuizzes] = useState<IQuizFull[]>(quizzes);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([QUIZ_1._id]);
  const [errorLogs, setErrorLogs] = useState<IErrorLog[]>([]);

  let filteredQuizzes = uploadedQuizzes.filter(quiz => selectedQuizzes.includes(quiz._id));

  if (playSettings.options.shuffle_quizzes && !playSettings.options.flatten_mix) filteredQuizzes = shuffle(filteredQuizzes);
  if (playSettings.options.shuffle_questions && !playSettings.options.flatten_mix) filteredQuizzes.forEach(quiz => quiz.questions = shuffle(quiz.questions));
  const allQuestions: TQuestionFull[] = [];
  filteredQuizzes.forEach(filteredQuiz => {
    filteredQuiz.questions = filteredQuiz.questions.filter(question => !playSettings.filters.excluded_difficulty.includes(question.difficulty) && !playSettings.filters.excluded_types.includes(question.type) && playSettings.filters.time_allocated[0] <= question.time_allocated && playSettings.filters.time_allocated[1] >= question.time_allocated);
    allQuestions.push(...filteredQuiz.questions)
  });

  return <PlayContext.Provider value={{ allQuestions, filteredQuizzes, setPlaySettings, playSettings, errorLogs, setErrorLogs, setPlaying, playing, uploadedQuizzes, selectedQuizzes, setUploadedQuizzes, setSelectedQuizzes }}>
    {!playing ? <div className="Play">
      <PlayUpload />
      <PlayErrorlogs />
      <List selectedItems={selectedQuizzes} setSelectedItems={setSelectedQuizzes} header="Uploaded Quizzes" items={uploadedQuizzes} setItems={setUploadedQuizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]} />
      <PlaySettings />
      <PlayTable />
    </div> : <Quiz />}
  </PlayContext.Provider>
}

export default Play;
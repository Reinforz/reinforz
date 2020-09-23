import React, { useState } from "react";
import { InputLabel, FormGroup, TextField, RadioGroup, FormControlLabel, Radio, Checkbox, Button, Select, MenuItem } from '@material-ui/core';

import Menu from "../../Basic/Menu";

import useThemeSettings from "../../../hooks/useThemeSettings";

import { IReportFilterState, QuestionDifficulty, QuestionType, QuizIdentifiers } from "../../../types";

import "./ReportFilter.scss";

const DEFAULT_REPORT_FILTER_STATE = { time_taken: [0, 60], verdict: 'mixed', hints_used: 'any', excluded_types: [], excluded_difficulty: [], excluded_quizzes: [], excluded_columns: [] } as IReportFilterState;

const click = new Audio(process.env.PUBLIC_URL + "/sounds/click.mp3",);
click.volume = 0.15;
const switchOn = new Audio(process.env.PUBLIC_URL + "/sounds/switch-on.mp3",);
switchOn.volume = 0.25;
const playOn = new Audio(process.env.PUBLIC_URL + "/sounds/pop-on.mp3",);
playOn.volume = 0.25;
const playOff = new Audio(process.env.PUBLIC_URL + "/sounds/pop-off.mp3",);
playOff.volume = 0.25;
const resetSettings = new Audio(process.env.PUBLIC_URL + "/sounds/reset.mp3",);
resetSettings.volume = 0.25;

const transformLabel = (stat: string) => {
  let label = stat.replace(/(\.|_)/g, " ");
  return label.split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ");
}
export default function (props: { selected_quizzes: QuizIdentifiers[], children: any }) {
  let REPORT_FILTERS: any = localStorage.getItem('REPORT_FILTERS');
  REPORT_FILTERS = REPORT_FILTERS ? JSON.parse(REPORT_FILTERS) : undefined;

  const { settings } = useThemeSettings();

  const [report_filter_state, setReportFilterState] = useState((REPORT_FILTERS ? REPORT_FILTERS : DEFAULT_REPORT_FILTER_STATE) as IReportFilterState);
  return props.children({
    ReportFilter:
      <Menu lskey="Report_menu" content_id="Report-content">
        <div className="ReportFilter">
          <FormGroup>
            <InputLabel>Time taken range</InputLabel>
            <TextField type="number" inputProps={{ max: report_filter_state.time_taken[1], step: 5, min: 0 }} value={report_filter_state.time_taken[0]} onChange={(e) => {
              if (settings.sound) click.play();
              setReportFilterState({ ...report_filter_state, time_taken: [(e.target as any).value, report_filter_state.time_taken[1]] })
            }} />
            <TextField type="number" inputProps={{ min: report_filter_state.time_taken[0], step: 5, max: 60 }} value={report_filter_state.time_taken[1]} onChange={(e) => {
              if (settings.sound) click.play();
              setReportFilterState({ ...report_filter_state, time_taken: [report_filter_state.time_taken[0], (e.target as any).value,] })
            }} />
          </FormGroup>
          <RadioGroup name="verdict" value={report_filter_state.verdict} >
            <InputLabel>Verdict</InputLabel>
            {[true, false, "mixed"].map((verdict, index) => <FormControlLabel onClick={(e: any) => {
              if (settings.sound) switchOn.play();
              setReportFilterState({ ...report_filter_state, verdict: e.target.value })
            }} key={verdict.toString() + index} value={verdict.toString()} control={<Radio color="primary" />} label={verdict.toString()} />)}
          </RadioGroup>
          <RadioGroup name="hints_used" value={report_filter_state.hints_used} >
            <InputLabel>Hints Used</InputLabel>
            {["0", "1", "2", "any"].map((hints, index) => <FormControlLabel onClick={(e: any) => {
              if (settings.sound) switchOn.play();
              setReportFilterState({ ...report_filter_state, hints_used: e.target.value })
            }} key={hints + index} value={hints} control={<Radio color="primary" />} label={hints} />)}
          </RadioGroup>
          <FormGroup>
            <InputLabel>Exluded Difficulty</InputLabel>
            {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={report_filter_state.excluded_difficulty.includes(difficulty as QuestionDifficulty)} name={difficulty} onChange={(e) => {
              if ((e.target as any).checked) {
                if (settings.sound) playOn.play()
                setReportFilterState({ ...report_filter_state, excluded_difficulty: report_filter_state.excluded_difficulty.concat(difficulty as QuestionDifficulty) });
              }
              else {
                if (settings.sound) playOff.play()
                setReportFilterState({ ...report_filter_state, excluded_difficulty: report_filter_state.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
              }
            }}
              color="primary" />} />)}
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Type</InputLabel>
            {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={report_filter_state.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
              if ((e.target as any).checked) {
                if (settings.sound) playOn.play()
                setReportFilterState({ ...report_filter_state, excluded_types: report_filter_state.excluded_types.concat(type as QuestionType) });
              }
              else {
                if (settings.sound) playOff.play()
                setReportFilterState({ ...report_filter_state, excluded_types: report_filter_state.excluded_types.filter(excluded_type => excluded_type !== type) })
              }
            }}
              color="primary" />} />)}
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Quizzes</InputLabel>
            <Select value={report_filter_state.excluded_quizzes}
              multiple
              onChange={(e) => {
                if (settings.sound) click.play();
                setReportFilterState({ ...report_filter_state, excluded_quizzes: e.target.value as string[] })
              }}>
              {props.selected_quizzes.map(selected_quiz =>
                <MenuItem key={selected_quiz._id} value={selected_quiz._id}>{selected_quiz.subject + "-" + selected_quiz.title}</MenuItem>
              )}
            </Select>
          </FormGroup>
          <FormGroup>
            <InputLabel>Exluded Columns</InputLabel>
            <Select value={report_filter_state.excluded_columns}
              multiple
              renderValue={(selected) => (selected as string[]).map((report_stat, index) => <div key={report_stat + "excluded_columns" + index}>{transformLabel(report_stat)}</div>)}
              onChange={(e) => {
                if (settings.sound) click.play();
                setReportFilterState({ ...report_filter_state, excluded_columns: e.target.value as string[] })
              }}>
              {["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"].map(report_stat =>
                <MenuItem key={report_stat} value={report_stat}>{transformLabel(report_stat)}</MenuItem>
              )}
            </Select>
          </FormGroup>
          <Button variant="contained" color="primary" onClick={() => {
            if (settings.sound) resetSettings.play()
            setReportFilterState(DEFAULT_REPORT_FILTER_STATE)
          }
          } style={{ width: "100%" }}>Reset</Button>
        </div>
      </Menu>,
    ReportFilterState: report_filter_state
  })
}
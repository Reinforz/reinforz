import React, { useState } from "react";
import { InputLabel, FormGroup, TextField, FormControlLabel, Checkbox, Button, Select, MenuItem } from '@material-ui/core';

import useThemeSettings from "../../../hooks/useThemeSettings";

import { IReportFilterState, QuestionDifficulty, QuestionType, QuizIdentifiers } from "../../../types";

import "./ReportFilter.scss";
import { CustomRadio } from "../../Basic/Radio";

const DEFAULT_REPORT_FILTER_STATE = { time_taken: [0, 60], verdict: 'mixed', hints_used: 'any', excluded_types: [], excluded_difficulty: [], excluded_quizzes: [], excluded_columns: [] } as IReportFilterState;

const transformLabel = (stat: string) => {
  let label = stat.replace(/(\.|_)/g, " ");
  return label.split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ");
}
export default function (props: { selected_quizzes: QuizIdentifiers[], children: any }) {
  let REPORT_FILTERS: any = localStorage.getItem('REPORT_FILTERS');
  REPORT_FILTERS = REPORT_FILTERS ? JSON.parse(REPORT_FILTERS) : undefined;

  const { settings, sounds: { click, reset, pop_off, pop_on } } = useThemeSettings();

  const [report_filter_state, setReportFilterState] = useState((REPORT_FILTERS ? REPORT_FILTERS : DEFAULT_REPORT_FILTER_STATE) as IReportFilterState);
  return props.children({
    ReportFilter:
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

        <CustomRadio name={"verdict"} items={[true, false, "mixed"]} state={report_filter_state} setState={setReportFilterState} />
        <CustomRadio name={"hints_used"} items={["0", "1", "2", "any"]} state={report_filter_state} setState={setReportFilterState} />

        <FormGroup>
          <InputLabel>Exluded Difficulty</InputLabel>
          {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={report_filter_state.excluded_difficulty.includes(difficulty as QuestionDifficulty)} name={difficulty} onChange={(e) => {
            if ((e.target as any).checked) {
              if (settings.sound) pop_on.play()
              setReportFilterState({ ...report_filter_state, excluded_difficulty: report_filter_state.excluded_difficulty.concat(difficulty as QuestionDifficulty) });
            }
            else {
              if (settings.sound) pop_off.play()
              setReportFilterState({ ...report_filter_state, excluded_difficulty: report_filter_state.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
            }
          }}
            color="primary" />} />)}
        </FormGroup>
        <FormGroup>
          <InputLabel>Exluded Type</InputLabel>
          {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={report_filter_state.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
            if ((e.target as any).checked) {
              if (settings.sound) pop_on.play()
              setReportFilterState({ ...report_filter_state, excluded_types: report_filter_state.excluded_types.concat(type as QuestionType) });
            }
            else {
              if (settings.sound) pop_off.play()
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
          if (settings.sound) reset.play()
          setReportFilterState(DEFAULT_REPORT_FILTER_STATE)
        }
        } style={{ width: "100%" }}>Reset</Button>
      </div>,
    ReportFilterState: report_filter_state
  })
}
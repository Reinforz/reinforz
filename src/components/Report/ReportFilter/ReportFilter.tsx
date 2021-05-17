import { Button, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@material-ui/core';
import React, { useContext, useState } from "react";
import { CheckboxGroup } from '../../../shared';
import { IReportFilterState } from "../../../types";
import { createDefaultReportFilterState } from '../../../utils';
import { PlayContext } from '../../Play/Play';
import "./ReportFilter.scss";

const transformLabel = (stat: string) => {
  let label = stat.replace(/(\.|_)/g, " ");
  return label.split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ");
}

export default function ReportFilter() {
  let REPORT_FILTERS: any = localStorage.getItem('REPORT_FILTERS');
  REPORT_FILTERS = REPORT_FILTERS ? JSON.parse(REPORT_FILTERS) : undefined;

  const { selectedQuizzes } = useContext(PlayContext);

  const [report_filter_state, setReportFilterState] = useState((REPORT_FILTERS ? REPORT_FILTERS : createDefaultReportFilterState()) as IReportFilterState);
  return <div className="ReportFilter">
    <FormGroup>
      <InputLabel>Time taken range</InputLabel>
      <TextField type="number" inputProps={{ max: report_filter_state.time_taken[1], step: 5, min: 0 }} value={report_filter_state.time_taken[0]} onChange={(e) => {
        setReportFilterState({ ...report_filter_state, time_taken: [(e.target as any).value, report_filter_state.time_taken[1]] })
      }} />
      <TextField type="number" inputProps={{ min: report_filter_state.time_taken[0], step: 5, max: 60 }} value={report_filter_state.time_taken[1]} onChange={(e) => {
        setReportFilterState({ ...report_filter_state, time_taken: [report_filter_state.time_taken[0], (e.target as any).value,] })
      }} />
    </FormGroup>
    <RadioGroup name="verdict" value={report_filter_state.verdict} >
      <InputLabel>Verdict</InputLabel>
      {[true, false, "mixed"].map((verdict, index) => <FormControlLabel onClick={(e: any) => {
        setReportFilterState({ ...report_filter_state, verdict: e.target.value })
      }} key={verdict.toString() + index} value={verdict.toString()} control={<Radio color="primary" />} label={verdict.toString()} />)}
    </RadioGroup>
    <RadioGroup name="hints_used" value={report_filter_state.hints_used} >
      <InputLabel>Hints Used</InputLabel>
      {["0", "1", "2", "any"].map((hints, index) => <FormControlLabel onClick={(e: any) => {
        setReportFilterState({ ...report_filter_state, hints_used: e.target.value })
      }} key={hints + index} value={hints} control={<Radio color="primary" />} label={hints} />)}
    </RadioGroup>
    <CheckboxGroup label={'Excluded Difficulty'} items={['Beginner', 'Intermediate', 'Advanced']} setState={setReportFilterState} stateKey={'excluded_difficulty'} state={report_filter_state} />
    <CheckboxGroup label={'Excluded Type'} items={['FIB', 'MS', 'MCQ', "Snippet"]} setState={setReportFilterState} stateKey={'excluded_types'} state={report_filter_state} />
    <FormGroup>
      <InputLabel>Exluded Quizzes</InputLabel>
      <Select value={report_filter_state.excluded_quizzes}
        multiple
        onChange={(e) => {
          setReportFilterState({ ...report_filter_state, excluded_quizzes: e.target.value as string[] })
        }}>
        {selectedQuizzes.map(selectedQuiz =>
          <MenuItem key={selectedQuiz} value={selectedQuiz}>{selectedQuiz}</MenuItem>
        )}
      </Select>
    </FormGroup>
    <FormGroup>
      <InputLabel>Exluded Columns</InputLabel>
      <Select value={report_filter_state.excluded_columns}
        multiple
        renderValue={(selected) => (selected as string[]).map((report_stat, index) => <div key={report_stat + "excluded_columns" + index}>{transformLabel(report_stat)}</div>)}
        onChange={(e) => {
          setReportFilterState({ ...report_filter_state, excluded_columns: e.target.value as string[] })
        }}>
        {["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"].map(report_stat =>
          <MenuItem key={report_stat} value={report_stat}>{transformLabel(report_stat)}</MenuItem>
        )}
      </Select>
    </FormGroup>
    <Button variant="contained" color="primary" onClick={() => {
      setReportFilterState(createDefaultReportFilterState())
    }
    } style={{ width: "100%" }}>Reset</Button>
  </div>
}
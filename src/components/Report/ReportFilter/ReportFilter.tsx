import { Button, FormGroup, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useContext, useState } from "react";
import { CheckboxGroup, RadioGroup } from '../../../shared';
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
    <RadioGroup items={["true", "false", "mixed"]} label={"Verdict"} setState={setReportFilterState} state={report_filter_state} stateKey={"verdict"} />
    <RadioGroup items={["0", "1", "2", "any"]} label={"Hints Used"} setState={setReportFilterState} state={report_filter_state} stateKey={"hints_used"} />
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
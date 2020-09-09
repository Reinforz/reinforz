import React, { useState } from "react";
import { InputLabel, FormGroup, TextField, RadioGroup, FormControlLabel, Radio, Checkbox } from '@material-ui/core';
import { ReportFilterState, Difficulty, QuestionType } from "../../../types";

export default function (props: { children: any }) {
  const [report_filter_state, setReportFilterState] = useState({ time_taken: [0, 60], verdict: 'mixed', hints_used: 'any', excluded_types: [], excluded_difficulty: [] } as ReportFilterState);

  return props.children({
    ReportFilter: <div className="Report-filter">
      <FormGroup>
        <InputLabel>Time taken range</InputLabel>
        <TextField type="number" inputProps={{ max: report_filter_state.time_taken[1], step: 5, min: 0 }} value={report_filter_state.time_taken[0]} onChange={(e) => setReportFilterState({ ...report_filter_state, time_taken: [(e.target as any).value, report_filter_state.time_taken[1]] })} label="Time Taken min" />
        <TextField type="number" inputProps={{ min: report_filter_state.time_taken[0], step: 5, max: 60 }} value={report_filter_state.time_taken[1]} onChange={(e) => setReportFilterState({ ...report_filter_state, time_taken: [report_filter_state.time_taken[0], (e.target as any).value,] })} label="Time Taken max" />
      </FormGroup>
      <RadioGroup name="verdict" value={report_filter_state.verdict} >
        <InputLabel>Verdict</InputLabel>
        {[true, false, "mixed"].map((verdict, index) => <FormControlLabel onClick={(e: any) => setReportFilterState({ ...report_filter_state, verdict: e.target.value })} key={verdict.toString() + index} value={verdict.toString()} control={<Radio color="primary" />} label={verdict.toString()} />)}
      </RadioGroup>
      <RadioGroup name="hints_used" value={report_filter_state.hints_used} >
        <InputLabel>Hints Used</InputLabel>
        {["0", "1", "2", "any"].map((hints, index) => <FormControlLabel onClick={(e: any) => setReportFilterState({ ...report_filter_state, hints_used: e.target.value })} key={hints + index} value={hints} control={<Radio color="primary" />} label={hints} />)}
      </RadioGroup>
      <FormGroup>
        <InputLabel>Exluded Difficulty</InputLabel>
        {['Beginner', 'Intermediate', 'Advanced'].map((difficulty, index) => <FormControlLabel key={difficulty + index} label={difficulty} control={<Checkbox checked={report_filter_state.excluded_difficulty.includes(difficulty as Difficulty)} name={difficulty} onChange={(e) => {
          if ((e.target as any).checked)
            setReportFilterState({ ...report_filter_state, excluded_difficulty: report_filter_state.excluded_difficulty.concat(difficulty as Difficulty) });
          else setReportFilterState({ ...report_filter_state, excluded_difficulty: report_filter_state.excluded_difficulty.filter(excluded_difficulty => excluded_difficulty !== difficulty) })
        }}
          color="primary" />} />)}
      </FormGroup>
      <FormGroup>
        <InputLabel>Exluded Type</InputLabel>
        {['FIB', 'MS', 'MCQ', "Snippet"].map((type, index) => <FormControlLabel key={type + index} label={type} control={<Checkbox checked={report_filter_state.excluded_types.includes(type as QuestionType)} name={type} onChange={(e) => {
          if ((e.target as any).checked)
            setReportFilterState({ ...report_filter_state, excluded_types: report_filter_state.excluded_types.concat(type as QuestionType) });
          else setReportFilterState({ ...report_filter_state, excluded_types: report_filter_state.excluded_types.filter(excluded_type => excluded_type !== type) })
        }}
          color="primary" />} />)}
      </FormGroup>
    </div>,
    report_filter_state
  })
}
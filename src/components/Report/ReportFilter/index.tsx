import React, { useState } from "react";
import { InputLabel, FormGroup, TextField } from '@material-ui/core';

import useThemeSettings from "../../../hooks/useThemeSettings";

import { ReportFilterState, ReportFilterProps } from "./types";

import "./style.scss";
import { MultiCheckbox, ResetButton, BasicRadio, MultiSelect, AdvancedSelect } from "../../Basic";

const DEFAULT_REPORT_FILTER_STATE = { time_taken: [0, 60], verdict: 'mixed', hints_used: 'any', excluded_types: [], excluded_difficulty: [], excluded_quizzes: [], excluded_columns: [] } as ReportFilterState;

export default function (props: ReportFilterProps) {
  let REPORT_FILTERS: any = localStorage.getItem('REPORT_FILTERS');
  REPORT_FILTERS = REPORT_FILTERS ? JSON.parse(REPORT_FILTERS) : undefined;

  const { settings, sounds: { click } } = useThemeSettings();

  const [report_filter_state, setReportFilterState] = useState<ReportFilterState>(REPORT_FILTERS ? REPORT_FILTERS : JSON.parse(JSON.stringify(DEFAULT_REPORT_FILTER_STATE)));

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

        <BasicRadio name={"verdict"} items={[true, false, "mixed"]} state={report_filter_state} setState={setReportFilterState} />
        <BasicRadio name={"hints_used"} items={["0", "1", "2", "any"]} state={report_filter_state} setState={setReportFilterState} />

        <MultiCheckbox name={"excluded_difficulty"} state={report_filter_state} setState={setReportFilterState} items={['Beginner', 'Intermediate', 'Advanced']} />
        <MultiCheckbox name={"excluded_types"} state={report_filter_state} setState={setReportFilterState} items={['FIB', 'MS', 'MCQ', "Snippet"]} />

        <MultiSelect items={["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"]} label={"Exluded Columns"} value={report_filter_state.excluded_columns} onChange={(e) => setReportFilterState({ ...report_filter_state, excluded_columns: e.target.value })} />
        <AdvancedSelect transformDisplay={(item) => item.subject + "-" + item.title} items={props.selected_quizzes} label={"Excluded Quizzes"} value={report_filter_state.excluded_quizzes} onChange={(e) => setReportFilterState({ ...report_filter_state, excluded_quizzes: e.target.value })} />

        <ResetButton onClick={() => {
          setReportFilterState(DEFAULT_REPORT_FILTER_STATE)
        }} />
      </div>,
    ReportFilterState: report_filter_state
  })
}

export * from "./types"
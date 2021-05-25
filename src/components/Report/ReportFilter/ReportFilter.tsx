import { Button, FormGroup, InputLabel, TextField } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useContext } from "react";
import { CheckboxGroup, RadioGroup, Select } from '../../../shared';
import { IReportFilterState } from "../../../types";
import { createDefaultReportFilterState } from '../../../utils';
import { PlayContext } from '../../Play/Play';
import "./ReportFilter.scss";

const transformLabel = (stat: string) => {
  let label = stat.replace(/(\.|_)/g, " ");
  return label.split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ");
}

interface Props {
  reportFilter: IReportFilterState,
  setReportFilter: Dispatch<SetStateAction<IReportFilterState>>
}

export default function ReportFilter(props: Props) {
  const { setReportFilter, reportFilter } = props;

  const { selectedQuizzes } = useContext(PlayContext);

  return <div className="ReportFilter">
    <FormGroup>
      <InputLabel>Time taken range</InputLabel>
      <TextField type="number" inputProps={{ max: reportFilter.time_taken[1], step: 5, min: 0 }} value={reportFilter.time_taken[0]} onChange={(e) => {
        setReportFilter({ ...reportFilter, time_taken: [(e.target as any).value, reportFilter.time_taken[1]] })
      }} />
      <TextField type="number" inputProps={{ min: reportFilter.time_taken[0], step: 5, max: 60 }} value={reportFilter.time_taken[1]} onChange={(e) => {
        setReportFilter({ ...reportFilter, time_taken: [reportFilter.time_taken[0], (e.target as any).value,] })
      }} />
    </FormGroup>
    <RadioGroup items={["true", "false", "mixed"]} label={"Verdict"} setState={setReportFilter} state={reportFilter} stateKey={"verdict"} />
    <RadioGroup items={["0", "1", "2", "any"]} label={"Hints Used"} setState={setReportFilter} state={reportFilter} stateKey={"hints_used"} />
    <CheckboxGroup label={'Excluded Difficulty'} items={['Beginner', 'Intermediate', 'Advanced']} setState={setReportFilter} stateKey={'excluded_difficulty'} state={reportFilter} />
    <CheckboxGroup label={'Excluded Type'} items={['FIB', 'MS', 'MCQ', "Snippet"]} setState={setReportFilter} stateKey={'excluded_types'} state={reportFilter} />
    <Select multiple label={"Excluded Quizzes"} items={selectedQuizzes} menuItemLabel={(item) => item} setState={setReportFilter} state={reportFilter} stateKey={"excluded_quizzes"} />
    <Select multiple label={"Excluded Columns"}
      renderValue={(selected) => (selected as string[]).map((report_stat, index) => <div key={report_stat + "excluded_columns" + index}>{transformLabel(report_stat)}</div>)}
      items={["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"]}
      menuItemLabel={(item) => transformLabel(item)}
      setState={setReportFilter}
      state={reportFilter}
      stateKey={"excluded_columns"}
    />

    <Button variant="contained" color="primary" onClick={() => {
      setReportFilter(createDefaultReportFilterState())
    }} style={{ width: "100%" }}>Reset</Button>
  </div>
}
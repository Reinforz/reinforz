import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeSettings } from '../../hooks';
import { TQuestionFull, TQuestionResult } from "../../types";
import { PlayContext } from '../Play/Play';
import "./Report.scss";
import ReportFilter from './ReportFilter/ReportFilter';

export interface Props {
  results: TQuestionResult[],
  all_questions_map: Record<string, TQuestionFull>,
  setResults: (results: any[]) => any
}

export default function Report(props: Props) {
  const { settings, sounds } = useThemeSettings();
  const history = useHistory();
  const { setPlaying, setUploadedQuizzes, setSelectedQuizzes, selectedQuizzes } = useContext(PlayContext);

  const transformValue = (header: string, content: any) => {
    const value = content[header];
    switch (header) {
      case "verdict":
        return <div style={{
          fontWeight: 'bolder', color: value === false ? "#ff3223" : "#36e336"
        }}>{value === false ? "Incorrect" : "Correct"}</div>
      case "answers":
      case "user_answers":
        if (content.type.match(/(MS|FIB)/))
          return value.map((value: any, index: number) => <div key={value + index}>{value}</div>);
        else return value
      default:
        return value?.toString() ?? "N/A";
    }
  }

  const total_weights = props.results.reduce((acc, cur) => acc + cur.weight, 0);

  const accumulator = (header: string, contents: Array<any>) => {
    switch (header) {
      case "time_allocated":
      case "time_taken":
      case "weight":
        return Number((contents.reduce((acc, cur) => acc + parseInt(cur), 0) / contents.length).toFixed(2));
      case "score":
        return total_weights !== 0 ? Number((contents.reduce((acc, cur) => acc + parseFloat(cur), 0) / total_weights).toFixed(2)) : 0;
      case "verdict":
        return contents.filter(content => content).length;
      default:
        return null;
    }
  }


  return (
    <div className="Report">
      <ReportFilter />
      {/* <ReportExport filtered_results={filtered_results} filtered_quizzes={Object.values(filtered_quizzes)} />
      <Table accumulator={accumulator} transformValue={transformValue} contents={filtered_results} collapseContents={["explanation"]} headers={["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"].filter(report_stat => !ReportFilterState.excluded_columns.includes(report_stat))} onHeaderClick={(header, order) => {
        if (header.match(/(score|time|hints)/))
          props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] - (b as any)[header] : (b as any)[header] - (a as any)[header]))
        else if (header === "verdict") props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] === false ? -1 : 1 : (a as any)[header] === true ? -1 : 1))
        else props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] > (b as any)[header] ? -1 : 1 : (a as any)[header] < (b as any)[header] ? -1 : 1))
      }} />

      <Button className="Report-buttons-item" variant="contained" color="primary" onClick={() => {
        localStorage.setItem("REPORT_FILTERS", JSON.stringify(ReportFilterState))
        setPlaying(false);
        setUploadedQuizzes(Object.values(filtered_quizzes))
        setSelectedQuizzes(Object.values(filtered_quizzes).map(quiz => quiz._id))
      }}>Back to Home</Button>

      <Button className="Report-buttons-item" variant="contained" color="primary" onClick={() => {
        if (settings.sound) sounds.swoosh.play()
        history.push("/settings")
      }}>Go to Settings</Button> */}
    </div>)
}
import { Button } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IQuizFull, TQuestionFull, TQuestionResult } from "../../types";
import { createDefaultReportFilterState } from '../../utils';
import { PlayContext } from '../Play/Play';
import "./Report.scss";
import ReportExport from './ReportExport/ReportExport';
import ReportFilter from './ReportFilter/ReportFilter';

export interface Props {
  results: TQuestionResult[],
  setResults: (results: any[]) => any
}

export default function Report(props: Props) {
  const history = useHistory();
  const { setPlaying, setUploadedQuizzes, setSelectedQuizzes, selectedQuizzes, allQuestionsMap } = useContext(PlayContext);

  const [reportFilter, setReportFilter] = useState(createDefaultReportFilterState());

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

  const { excluded_types, excluded_quizzes, excluded_difficulty, verdict, hints_used, time_taken } = reportFilter;
  const filteredResults = props.results.filter(result => !excluded_types.includes(result.type) && !excluded_difficulty.includes(result.difficulty) && (verdict === "mixed" || verdict.toString() === result.verdict?.toString()) && (hints_used === "any" || result.hints_used <= hints_used) && time_taken[0] <= result.time_taken && time_taken[1] >= result.time_taken && !excluded_quizzes.includes(result.quiz._id))
  const filteredQuizzes: Record<string, IQuizFull> = {};
  filteredResults.forEach(filteredResult => {
    const targetQuestion = allQuestionsMap.get(filteredResult.question_id)!
    const clonedTargetQuestion = JSON.parse(JSON.stringify(targetQuestion)) as TQuestionFull;
    if (!filteredQuizzes[targetQuestion.quiz._id]) filteredQuizzes[targetQuestion.quiz._id] = {
      ...targetQuestion.quiz,
      questions: [
        clonedTargetQuestion
      ]
    };
    else filteredQuizzes[targetQuestion.quiz._id].questions.push(clonedTargetQuestion)
  });

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
      <ReportFilter reportFilter={reportFilter} setReportFilter={setReportFilter} />
      <ReportExport filteredResults={filteredResults} filteredQuizzes={Object.values(filteredQuizzes)} />
      {/* <Table accumulator={accumulator} transformValue={transformValue} contents={filtered_results} collapseContents={["explanation"]} headers={["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"].filter(report_stat => !ReportFilterState.excluded_columns.includes(report_stat))} onHeaderClick={(header, order) => {
        if (header.match(/(score|time|hints)/))
          props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] - (b as any)[header] : (b as any)[header] - (a as any)[header]))
        else if (header === "verdict") props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] === false ? -1 : 1 : (a as any)[header] === true ? -1 : 1))
        else props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] > (b as any)[header] ? -1 : 1 : (a as any)[header] < (b as any)[header] ? -1 : 1))
      }} /> */}
      <div className="ReportBackButton">
        <Button variant="contained" color="primary" onClick={() => {
          localStorage.setItem("REPORT_FILTERS", JSON.stringify(reportFilter))
          setPlaying(false);
          setUploadedQuizzes(Object.values(filteredQuizzes))
          setSelectedQuizzes(Object.values(filteredQuizzes).map(quiz => quiz._id))
        }}>Back to Home</Button>
      </div>
    </div>)
}
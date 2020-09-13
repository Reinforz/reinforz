import React, { Fragment } from 'react';

import Table from "../Basic/Table";
import ReportFilter from './ReportFilter/ReportFilter';
import ReportExport from './ReportExport/ReportExport';

import { ReportFilterRProps, ReportProps } from "../../types";

import "./Report.scss";

export default function (props: ReportProps) {
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

  const accumulator = (header: string, contents: Array<any>) => {
    switch (header) {
      case "time_allocated":
      case "score":
      case "time_taken":
        return contents.reduce((acc, cur) => acc + parseInt(cur), 0) / contents.length;
      case "verdict":
        return contents.filter(content => content).length;
      default:
        return null;
    }
  }

  return (
    <div className="Report">
      <ReportFilter>
        {({ report_filter_state, ReportFilter }: ReportFilterRProps) => {
          const { excluded_types, excluded_difficulty, verdict, hints_used, time_taken } = report_filter_state;
          const filtered_results = props.results.filter(result => !excluded_types.includes(result.type) && !excluded_difficulty.includes(result.difficulty) && (verdict === "mixed" || verdict.toString() === result.verdict.toString()) && (hints_used === "any" || result.hints_used <= hints_used) && time_taken[0] <= result.time_taken && time_taken[1] >= result.time_taken)
          return <Fragment>
            {ReportFilter}
            <ReportExport filtered_results={filtered_results} all_questions_map={props.all_questions_map} />
            <Table accumulator={accumulator} transformValue={transformValue} contents={filtered_results} collapseContents={["explanation"]} headers={["question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "user_answers", "hints_used"]} />
          </Fragment>
        }}
      </ReportFilter>
    </div>
  );
}
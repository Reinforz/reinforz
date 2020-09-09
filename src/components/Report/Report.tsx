import React, { useState, Fragment } from 'react';
import styled from "styled-components";
import GetAppIcon from '@material-ui/icons/GetApp';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { safeDump } from 'js-yaml';

import "./Report.scss";

import Table from "../Table";
import download from "../../utils/download";
import ReportFilter from './ReportFilter/ReportFilter';

import { ReportFilterRProps, Result, QuestionInputFull } from "../../types";

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function Report(props: { results: Result[], all_questions: QuestionInputFull[] }) {
  const [export_type, setExportType] = useState('Original');
  const [export_as, setExportAs] = useState('YAML');

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
          return value.map((value: any, index: number) => <div key={value + index}>{value.replace(/^_(\w{2}\s?)*_/g, '')}</div>);
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
          return <Fragment>
            {ReportFilter}
            <ReportContainer className="Report-container">
              <div>
                <FormControl >
                  <InputLabel >Export Type</InputLabel>
                  <Select
                    value={export_type}
                    onChange={(e) => setExportType((e.target as any).value)}
                  >
                    <MenuItem value={'Original'}>Original</MenuItem>
                    <MenuItem value={'Report'}>Report</MenuItem>
                  </Select>
                </FormControl>
                <FormControl >
                  <InputLabel >Export As</InputLabel>
                  <Select
                    value={export_as}
                    onChange={(e) => setExportAs((e.target as any).value)}
                  >
                    {['YAML', 'JSON'].map(((type, index) => <MenuItem value={type} key={type + index}>{type}</MenuItem>))}
                  </Select>
                </FormControl>
                <GetAppIcon onClick={() => {
                  export_as === "JSON" ? download(`$Report${Date.now()}.json`, JSON.stringify(export_type === "Report" ? props.results : props.all_questions)) : download(`Report${Date.now()}.yaml`, safeDump(export_type === "Report" ? props.results : props.all_questions));
                }} />
              </div>
              <Table accumulator={accumulator} transformValue={transformValue} contents={props.results} collapseContents={["explanation"]} headers={["question", "type", "verdict", "score", "time_allocated", "time_taken", "answers", "user_answers", "hints_used"]} />
            </ReportContainer>
          </Fragment>
        }}
      </ReportFilter>

    </div>
  );
}

export default Report;
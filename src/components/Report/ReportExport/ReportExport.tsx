import React, { useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { safeDump } from 'js-yaml';

import download from "../../../utils/download";

import { ReportExportProps } from "../../../types";

export default function (props: ReportExportProps) {
  const { filtered_results, all_questions_map } = props;

  const [export_type, setExportType] = useState('Original');
  const [export_as, setExportAs] = useState('YAML');
  return (
    <div className="ReportExport">
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
        export_as === "JSON" ? download(`$Report${Date.now()}.json`, JSON.stringify(export_type === "Report" ? filtered_results : filtered_results.map(filtered_result => all_questions_map[filtered_result.question_id]))) : download(`Report${Date.now()}.yaml`, safeDump(export_type === "Report" ? filtered_results : filtered_results.map(filtered_result => all_questions_map[filtered_result.question_id])));
      }} />
    </div>
  );
}


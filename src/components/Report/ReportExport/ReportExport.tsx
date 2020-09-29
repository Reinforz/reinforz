import React, { useCallback, useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { safeDump } from 'js-yaml';
import clone from 'just-clone';

import Icon from '../../Basic/Icon';

import useThemeSettings from '../../../hooks/useThemeSettings';

import download from "../../../utils/download";

import { ReportExportProps } from "../../../types";

import "./ReportExport.scss"

const click = new Audio(process.env.PUBLIC_URL + "/sounds/click.mp3");
click.volume = 0.15

export default function (props: ReportExportProps) {
  const { filtered_results, filtered_quizzes } = props;
  let REPORT_EXPORT: any = localStorage.getItem('REPORT_EXPORT');
  REPORT_EXPORT = REPORT_EXPORT ? JSON.parse(REPORT_EXPORT) : undefined;
  const { theme, settings } = useThemeSettings();

  const [export_type, setExportType] = useState((REPORT_EXPORT ? REPORT_EXPORT.export_type : 'Original') as string);
  const [export_as, setExportAs] = useState((REPORT_EXPORT ? REPORT_EXPORT.export_as : 'YAML') as string);

  const cloned_download = useCallback((type) => {
    Object.values(filtered_quizzes).forEach(quiz => {
      quiz.questions = quiz.questions.map(question => {
        const cloned_question = clone(question);
        delete cloned_question.quiz;
        return cloned_question;
      })
      type === "yaml" ? download(`${quiz.subject} - ${quiz.title}.yaml`, safeDump(quiz)) : download(`${quiz.subject} - ${quiz.title}.json`, JSON.stringify(quiz, undefined, 2))
    })
  }, [filtered_quizzes])
  const downloadfiles = () => {
    if (export_as === "JSON") {
      if (export_type === "Report") download(`Report${Date.now()}.json`, JSON.stringify(filtered_results, undefined, 2));
      else
        cloned_download("json")
    } else {
      if (export_type === "Report") download(`Report${Date.now()}.yaml`, safeDump(filtered_results));
      else
        cloned_download("yaml")
    }
  }

  return (
    <div className="ReportExport">
      <FormControl >
        <InputLabel >Export Type</InputLabel>
        <Select
          value={export_type}
          onChange={(e) => {
            if (settings.sound) click.play()
            setExportType((e.target as any).value)
          }}
        >
          <MenuItem value={'Original'}>Original</MenuItem>
          <MenuItem value={'Report'}>Report</MenuItem>
        </Select>
      </FormControl>
      <FormControl >
        <InputLabel >Export As</InputLabel>
        <Select
          value={export_as}
          onChange={(e) => {
            if (settings.sound) click.play()
            setExportAs((e.target as any).value)
          }}
        >
          {['YAML', 'JSON'].map(((type, index) => <MenuItem value={type} key={type + index}>{type}</MenuItem>))}
        </Select>
      </FormControl>
      <Icon popoverText={`Export ${export_type} as ${export_as}`} >
        <GetAppIcon style={{ fill: theme.color.opposite_dark }} onClick={() => {
          if (settings.sound) click.play()
          downloadfiles()
        }} />
      </Icon>
    </div>
  );
}


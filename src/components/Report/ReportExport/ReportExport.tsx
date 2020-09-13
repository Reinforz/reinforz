import React, { useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { InputLabel, FormControl, Select, MenuItem, useTheme } from '@material-ui/core';
import { safeDump } from 'js-yaml';

import Icon from '../../Basic/Icon';

import download from "../../../utils/download";

import { ExtendedTheme, QuestionInput, ReportExportProps, QuestionInputFull } from "../../../types";

import "./ReportExport.scss"

export default function (props: ReportExportProps) {
  const { filtered_results, all_questions_map } = props;
  let REPORT_EXPORT: any = localStorage.getItem('REPORT_EXPORT');
  REPORT_EXPORT = REPORT_EXPORT ? JSON.parse(REPORT_EXPORT) : undefined;
  const theme = useTheme() as ExtendedTheme;

  const [export_type, setExportType] = useState((REPORT_EXPORT ? REPORT_EXPORT.export_type : 'Original') as string);
  const [export_as, setExportAs] = useState((REPORT_EXPORT ? REPORT_EXPORT.export_as : 'YAML') as string);
  type question_keys = keyof QuestionInputFull;
  const filtered_quizzes: Record<string, any> = {};
  filtered_results.forEach(filtered_result => {
    const target_question = all_questions_map[filtered_result.question_id]
    const obj: Record<string, any> = {};
    ([
      "type",
      "format",
      "image",
      "weight",
      "add_to_score",
      "time_allocated",
      "difficulty",
      "correct_answer_message",
      "incorrect_answer_message",
      "explanation",
      "hints",
      "language",
      "options",
      "question",
      "answers"
    ] as question_keys[]).forEach(key => obj[key] = target_question[key]);

    if (!filtered_quizzes[target_question.quiz._id]) filtered_quizzes[target_question.quiz._id] = {
      title: target_question.quiz.title,
      subject: target_question.quiz.subject,
      questions: [
        obj
      ]
    }
    else filtered_quizzes[target_question.quiz._id].questions.push(obj)
    return obj as QuestionInput;
  });

  const downloadfiles = () => {
    if (export_as === "JSON") {
      if (export_type === "report") download(`Report${Date.now()}.json`, JSON.stringify(filtered_results, undefined, 2));
      else
        Object.values(filtered_quizzes).forEach(quiz => download(`${quiz.subject} - ${quiz.title}.json`, JSON.stringify(quiz, undefined, 2)))
    } else {
      if (export_type === "report") download(`Report${Date.now()}.yaml`, safeDump(filtered_results));
      else
        Object.values(filtered_quizzes).forEach(quiz => download(`${quiz.subject} - ${quiz.title}.yaml`, safeDump(quiz)))
    }
  }

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
      <Icon style={{ fill: theme.color.opposite_dark }} popoverText={`Export ${export_type} as ${export_as}`} icon={GetAppIcon} onClick={() => downloadfiles()} />
    </div>
  );
}


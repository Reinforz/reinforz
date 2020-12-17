import React, { useCallback, useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { safeDump } from 'js-yaml';
import clone from 'just-clone';

import Icon from '../../Basic/Icon';

import { CustomSelect } from '../../Basic';

import { useThemeSettings } from '../../../hooks'

import { download } from "../../../utils";

import { ReportExportProps, TReportExportAs, TReportExportType } from "./types";

import "./style.scss"

export default function (props: ReportExportProps) {
  const { filtered_results, filtered_quizzes } = props;
  let REPORT_EXPORT: any = localStorage.getItem('REPORT_EXPORT');
  REPORT_EXPORT = REPORT_EXPORT ? JSON.parse(REPORT_EXPORT) : undefined;
  const { theme, settings, sounds: { click } } = useThemeSettings();

  const [export_type, setExportType] = useState((REPORT_EXPORT ? REPORT_EXPORT.export_type : 'Original') as TReportExportType);
  const [export_as, setExportAs] = useState((REPORT_EXPORT ? REPORT_EXPORT.export_as : 'YAML') as TReportExportAs);

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
      <CustomSelect label={"Export Type"} value={export_type} onChange={(e) => setExportType((e.target as any).value)} items={['Original', 'Report']} />
      <CustomSelect label={"Export As"} value={export_as} onChange={(e) => setExportAs((e.target as any).value)} items={['YAML', 'JSON']} />

      <Icon popoverText={`Export ${export_type} as ${export_as}`} >
        <GetAppIcon style={{ fill: theme.color.opposite_dark }} onClick={() => {
          if (settings.sound) click.play()
          downloadfiles()
        }} />
      </Icon>
    </div>
  );
}

export * from "./types";
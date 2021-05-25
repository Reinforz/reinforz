import GetAppIcon from '@material-ui/icons/GetApp';
import { safeDump } from 'js-yaml';
import React, { useCallback, useState } from 'react';
import { useThemeSettings } from '../../../hooks';
import { Icon, Select } from '../../../shared';
import { IQuizFull, TQuestionResult } from "../../../types";
import { download } from "../../../utils";
import "./ReportExport.scss";

interface Props {
  filteredResults: TQuestionResult[],
  filteredQuizzes: IQuizFull[]
}

interface IReportExportState {
  export_type: 'Original' | 'Report',
  export_as: 'JSON' | 'YAML'
}

export default function ReportExport(props: Props) {
  const { filteredResults, filteredQuizzes } = props;
  let REPORT_EXPORT: any = localStorage.getItem('REPORT_EXPORT');
  REPORT_EXPORT = REPORT_EXPORT ? JSON.parse(REPORT_EXPORT) : undefined;
  const { theme, settings, sounds: { click } } = useThemeSettings();

  const [exportState, setExportState] = useState<IReportExportState>({
    export_type: REPORT_EXPORT ? REPORT_EXPORT.export_type : 'Original',
    export_as: REPORT_EXPORT ? REPORT_EXPORT.export_as : 'YAML'
  });

  const { export_type, export_as } = exportState;

  const clonedDownload = useCallback((type) => {
    Object.values(filteredQuizzes).forEach(quiz => {
      quiz.questions = quiz.questions.map(question => {
        const cloned_question = JSON.parse(JSON.stringify(question));
        delete cloned_question.quiz;
        return cloned_question;
      })
      type === "yaml" ? download(`${quiz.subject} - ${quiz.title}.yaml`, safeDump(quiz)) : download(`${quiz.subject} - ${quiz.title}.json`, JSON.stringify(quiz, undefined, 2))
    })
  }, [filteredQuizzes])

  const downloadFiles = () => {
    if (export_as === "JSON") {
      if (export_type === "Report") download(`Report${Date.now()}.json`, JSON.stringify(filteredResults, undefined, 2));
      else
        clonedDownload("json")
    } else {
      if (export_type === "Report") download(`Report${Date.now()}.yaml`, safeDump(filteredResults));
      else
        clonedDownload("yaml")
    }
  }

  return (
    <div className="ReportExport">
      <Select items={['Original', 'Report']} label={"Export Type"} menuItemLabel={(item) => item} setState={setExportState} state={exportState} stateKey={"export_type"} />
      <Select items={['YAML', 'JSON']} label={"Export As"} menuItemLabel={(item) => item} setState={setExportState} state={exportState} stateKey={"export_as"} />
      <Icon popoverText={`Export ${export_type} as ${export_as}`} >
        <GetAppIcon style={{ fill: theme.color.opposite_dark }} onClick={() => {
          if (settings.sound) click.play()
          downloadFiles()
        }} />
      </Icon>
    </div>
  );
}


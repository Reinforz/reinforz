import React, { Fragment, useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import clone from 'just-clone';

import Table from "../Basic/Table";
import ReportFilter from './ReportFilter/ReportFilter';
import ReportExport from './ReportExport';
import Menu from "../Basic/Menu";

import PlayContext from '../../context/PlayContext';

import useThemeSettings from '../../hooks/useThemeSettings';

import { IPlayContext, QuestionInputFull, QuizInputFull, ReportFilterRProps, MenuRProps } from "../../types";

import "./style.scss";
import { ReportProps } from './types';

const accumulator = (header: string, contents: Array<any>, total_weights: number) => {
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

export default function (props: ReportProps) {
  const { settings, sounds } = useThemeSettings(),
    history = useHistory(),
    PlayContextValue = useContext(PlayContext) as IPlayContext;

  return (
    <div className="Report">
      <ReportFilter selected_quizzes={props.selected_quizzes}>
        {({ ReportFilterState, ReportFilter }: ReportFilterRProps) => {
          const { excluded_types, excluded_quizzes, excluded_difficulty, verdict, hints_used, time_taken } = ReportFilterState;
          const filtered_results = props.results.filter(result => !excluded_types.includes(result.type) && !excluded_difficulty.includes(result.difficulty) && (verdict === "mixed" || verdict.toString() === result.verdict?.toString()) && (hints_used === "any" || result.hints_used <= hints_used) && time_taken[0] <= result.time_taken && time_taken[1] >= result.time_taken && !excluded_quizzes.includes(result.quizId))
          const filtered_quizzes: Record<string, QuizInputFull> = {};
          filtered_results.forEach(filtered_result => {
            const target_question = props.all_questions_map[filtered_result.question_id]
            const obj = clone(target_question) as QuestionInputFull;

            if (!filtered_quizzes[target_question.quiz._id]) filtered_quizzes[target_question.quiz._id] = {
              title: target_question.quiz.title,
              subject: target_question.quiz.subject,
              _id: target_question.quiz._id,
              questions: [
                obj
              ]
            } as QuizInputFull;
            else filtered_quizzes[target_question.quiz._id].questions.push(obj)
            return obj;
          });

          return <Menu lskey="Report_menu" content={ReportFilter}>
            {({ MenuComponent, MenuExtra }: MenuRProps) => {
              return <Fragment>
                {MenuComponent}
                <div id="Report-content" className="Report-content" style={{ ...MenuExtra.content_elem_style }}>
                  <ReportExport filtered_results={filtered_results} filtered_quizzes={Object.values(filtered_quizzes)} />
                  <Table accumulator={(header, contents) => accumulator(header, contents, props.results.reduce((acc, cur) => acc + cur.weight, 0))} transformValue={transformValue} contents={filtered_results} collapseContents={["explanation"]} headers={["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "weight", "user_answers", "hints_used"].filter(report_stat => !ReportFilterState.excluded_columns.includes(report_stat))} onHeaderClick={(header, order) => {
                    if (header.match(/(score|time|hints)/))
                      props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] - (b as any)[header] : (b as any)[header] - (a as any)[header]))
                    else if (header === "verdict") props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] === false ? -1 : 1 : (a as any)[header] === true ? -1 : 1))
                    else props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] > (b as any)[header] ? -1 : 1 : (a as any)[header] < (b as any)[header] ? -1 : 1))
                  }} />
                  <div className="Report-buttons">
                    <Button className="Report-buttons-item" variant="contained" color="primary" onClick={() => {
                      if (settings.sound) sounds.swoosh.play()
                      localStorage.setItem("REPORT_FILTERS", JSON.stringify(ReportFilterState))
                      PlayContextValue.setPlaying(false);
                      PlayContextValue.setQuizzes(Object.values(filtered_quizzes))
                      PlayContextValue.setSelected(Object.values(filtered_quizzes).map(quiz => quiz._id))
                    }}>Back to Home</Button>
                    <Button className="Report-buttons-item" variant="contained" color="primary" onClick={() => {
                      if (settings.sound) sounds.swoosh.play()
                      history.push("/settings")
                    }}>Go to Settings</Button>
                  </div>
                </div>
              </Fragment>
            }}
          </Menu>
        }}
      </ReportFilter>
    </div>
  );
}

export * from "./types"
import React, { Fragment, useContext } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import Table from "../Basic/Table";
import ReportFilter from './ReportFilter/ReportFilter';
import ReportExport from './ReportExport/ReportExport';

import PlayContext from '../../context/PlayContext';

import { IPlayContext, QuestionInput, QuestionInputFull, ReportFilterRProps, ReportProps, } from "../../types";

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
        return Number((contents.reduce((acc, cur) => acc + parseInt(cur), 0) / contents.length).toFixed(2));
      case "verdict":
        return contents.filter(content => content).length;
      default:
        return null;
    }
  }

  const history = useHistory();
  const PlayContextValue = useContext(PlayContext) as IPlayContext;
  return (
    <div className="Report">
      <ReportFilter selected_quizzes={props.selected_quizzes}>
        {({ ReportFilterState, ReportFilter }: ReportFilterRProps) => {
          const { excluded_types, excluded_quizzes, excluded_difficulty, verdict, hints_used, time_taken } = ReportFilterState;
          const filtered_results = props.results.filter(result => !excluded_types.includes(result.type) && !excluded_difficulty.includes(result.difficulty) && (verdict === "mixed" || verdict.toString() === result.verdict?.toString()) && (hints_used === "any" || result.hints_used <= hints_used) && time_taken[0] <= result.time_taken && time_taken[1] >= result.time_taken && !excluded_quizzes.includes(result.quizId))
          type question_keys = keyof QuestionInputFull;
          const filtered_quizzes: Record<string, any> = {};
          filtered_results.forEach(filtered_result => {
            const target_question = props.all_questions_map[filtered_result.question_id]
            const obj: Record<string, QuestionInput> = {};
            ([
              "type",
              "format",
              "image",
              "weight",
              "time_allocated",
              "difficulty",
              "correct_answer_message",
              "incorrect_answer_message",
              "explanation",
              "hints",
              "language",
              "options",
              "question",
              "answers",
              "quiz"
            ]).forEach(key => obj[key as question_keys] = target_question[key as question_keys]);

            if (!filtered_quizzes[target_question.quiz._id]) filtered_quizzes[target_question.quiz._id] = {
              title: target_question.quiz.title,
              subject: target_question.quiz.subject,
              _id: target_question.quiz._id,
              questions: [
                obj
              ]
            }
            else filtered_quizzes[target_question.quiz._id].questions.push(obj)
            return obj;
          });

          return <Fragment>
            {ReportFilter}
            <ReportExport filtered_results={filtered_results} filtered_quizzes={Object.values(filtered_quizzes)} />
            <Table accumulator={accumulator} transformValue={transformValue} contents={filtered_results} collapseContents={["explanation"]} headers={["quiz", "subject", "question", "type", "difficulty", "verdict", "score", "time_allocated", "time_taken", "answers", "user_answers", "hints_used"].filter(report_stat => !ReportFilterState.excluded_columns.includes(report_stat))} onHeaderClick={(header, order) => {
              if (header.match(/(score|time|hints)/))
                props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] - (b as any)[header] : (b as any)[header] - (a as any)[header]))
              else if (header === "verdict") props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] === false ? -1 : 1 : (a as any)[header] === true ? -1 : 1))
              else props.setResults(filtered_results.sort((a, b) => order === "DESC" ? (a as any)[header] > (b as any)[header] ? -1 : 1 : (a as any)[header] < (b as any)[header] ? -1 : 1))
            }} />
            <div className="Report-buttons">
              <Button className="Report-buttons-item" variant="contained" color="primary" onClick={() => {
                localStorage.setItem("REPORT_FILTERS", JSON.stringify(ReportFilterState))
                PlayContextValue.setPlaying(false);
                PlayContextValue.setQuizzes(Object.values(filtered_quizzes))
                PlayContextValue.setSelected(Object.values(filtered_quizzes).map(quiz => quiz._id))
              }}>Back to Home</Button>
              <Button className="Report-buttons-item" variant="contained" color="primary" onClick={() => history.push("/settings")}>Go to Settings</Button>
            </div>
          </Fragment>
        }}
      </ReportFilter>
    </div>
  );
}
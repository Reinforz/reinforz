import React from 'react';
import { QuizInputFull } from '../types';

import Table from "./Table"

function QuestionStats(props: { quizzes: QuizInputFull[] }) {
  return (
    <div className="QuestionStats">
      <Table className="QuestionStats-table QuestionStats-table--difficulty" title={"Difficulty based Table"} accumulator={(header, contents) => {
        switch (header) {
          case "Beginner":
          case "Intermediate":
          case "Advanced":
            return contents?.reduce((acc: number, cur: number) => acc + cur, 0);
          default:
            return null
        }
      }} contents={props.quizzes.map(({ questions, title, _id }) => {
        const difficulty_map: Record<string, any> = {
          Beginner: 0,
          Intermediate: 0,
          Advanced: 0,
          _id,
          title
        };
        questions.forEach(({ difficulty }) => {
          difficulty_map[difficulty]++;
        })
        return difficulty_map;
      })} headers={['title', "Beginner", "Intermediate", "Advanced"]} />
      <Table className="QuestionStats-table QuestionStats-table--type" title={"Type based Table"} accumulator={(header, contents) => {
        switch (header) {
          case "Snippet":
          case "MS":
          case "FIB":
          case "MCQ":
            return contents?.reduce((acc: number, cur: number) => acc + cur, 0);
          default:
            return null
        }
      }} contents={props.quizzes.map(({ questions, title, _id }) => {
        const type_map: Record<string, any> = {
          Snippet: 0,
          MS: 0,
          FIB: 0,
          MCQ: 0,
          _id,
          title
        };
        questions.forEach(({ type }) => {
          type_map[type]++;
        })
        return type_map;
      })} headers={['title', "Snippet", "MS", "MCQ", "FIB"]} />
      <Table className="QuestionStats-table QuestionStats-table--time_allocated" title={"Time based Table"} accumulator={(header, contents) => {
        if (header.match(/(title|_id)/)) return null;
        else return contents?.reduce((acc: number, cur: number) => acc + (cur ?? 0), 0);
      }} contents={props.quizzes.map(({ questions, title, _id }) => {
        const time_allocated_map: Record<string, any> = {
          _id,
          title
        };
        questions.forEach(({ time_allocated }) => {
          const time = Math.ceil(time_allocated / 15) * 15;
          if (!time_allocated_map[time]) time_allocated_map[time] = 1;
          else time_allocated_map[time]++;
        })
        return time_allocated_map;
      })} headers={['title', "15", "30", "45", "60"]} />
    </div>
  );
}

export default QuestionStats;
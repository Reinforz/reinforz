import React from 'react';
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, TextField, useTheme } from "@material-ui/core";

import { ExtendedTheme, QuestionOptionsProps } from '../../../types';

import "./QuestionOptions.scss";

export default function (props: QuestionOptionsProps) {
  const theme = useTheme() as ExtendedTheme;

  const { changeOption, user_answers, question: { index, _id, type, options } } = props;
  const generateOptions = () => {
    if (type === "MCQ" && options)
      return <RadioGroup className="QuestionOptions-container QuestionOptions-container--MCQ" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} onChange={e => changeOption([e.target.value])}>
        {options.map((option, i) => (
          <div className="QuestionOptions-container-item" style={{ backgroundColor: theme.color.base }} key={`${_id}option${index}${i}`}>
            <FormControlLabel
              control={<Radio color="primary" />}
              value={`${i}`}
              label={option.toString()}
              labelPlacement="end"
            />
          </div>
        ))}
      </RadioGroup>
    else if (type === "MS" && options) {
      const temp_user_answers = [...(user_answers as string[])];
      return <FormGroup className="QuestionOptions-container QuestionOptions-container--MS" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} onChange={(e: any) => {
        if (e.target.checked) {
          temp_user_answers.push(e.target.value);
          changeOption([...temp_user_answers])
        }
        else
          changeOption(temp_user_answers.filter(temp_user_answer => temp_user_answer !== e.target.value));
      }}>
        {options.map((option, i) => (
          <div className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }} key={`${_id}option${index}${i}`}>
            <FormControlLabel
              control={<Checkbox checked={temp_user_answers.includes(`${i}`)} value={`${i}`} color="primary" />}
              label={option.toString()}
            /></div>))}
      </FormGroup>
    }

    else if (type === "Snippet")
      return <div className="QuestionOptions-container QuestionOptions-container--Snippet" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}><div className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }}>
        <TextField fullWidth value={user_answers[0]} onChange={e => {
          user_answers[0] = e.target.value;
          changeOption([...user_answers])
        }} /></div></div>
  }

  return (
    <div className={`QuestionOptions QuestionOptions--${type}`}>
      {generateOptions()}
    </div>
  );
}


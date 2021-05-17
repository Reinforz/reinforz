import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup } from "@material-ui/core";
import { Language } from 'prism-react-renderer';
import React from 'react';
import { useThemeSettings } from '../../../hooks';
import { Highlighter } from "../../../shared";
import { QuestionInputFull } from '../../../types';
import "./QuestionOptions.scss";

interface Props {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: QuestionInputFull,
}

export default function QuestionOptions(props: Props) {
  const { theme } = useThemeSettings();
  const { changeOption, user_answers, question: { _id, type, options } } = props;
  const generateOptions = () => {
    if (type === "MCQ" && options) {
      return <RadioGroup className="QuestionOptions-container QuestionOptions-container--MCQ" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} onChange={e => changeOption([e.target.value])}>
        {options.map((option, i) => {
          const matches = option.match(/_(.*?)_(.+)/);
          let format = "text";
          if (matches) {
            option = matches[2];
            format = matches[1];
          }
          return <div key={`${_id}option${i}`} className="QuestionOptions-container-item" style={{ backgroundColor: theme.color.base }}>
            <FormControlLabel
              control={<Radio color="primary" />}
              value={`${i}`}
              label={format.startsWith("code") ? <Highlighter code={option.toString()} language={(format.split("=")[1] || "javascript") as Language} /> : option.toString()}
              labelPlacement="end"
            />
          </div>
        })}
      </RadioGroup>
    }
    else if (type === "MS" && options) {
      return <FormGroup className="QuestionOptions-container QuestionOptions-container--MS" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} onChange={(e: any) => {
        if (e.target.checked)
          changeOption(user_answers.concat(e.target.value))
        else
          changeOption(user_answers.filter(user_answer => user_answer !== e.target.value));
      }}>
        {options.map((option, i) => {
          return <div key={`${_id}option${i}`} className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }}>
            <FormControlLabel
              control={<Checkbox checked={user_answers.includes(`${i}`)} value={`${i}`} color="primary" />}
              label={option}
            /></div>
        })}
      </FormGroup>
    }

    /* else if (type === "Snippet")
      return <div className="QuestionOptions-container QuestionOptions-container--Snippet" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}><div className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }}>
      <TextField fullWidth value={user_answers[0]} onChange={e => {
        user_answers[0] = e.target.value;
        changeOption([...user_answers])
    }} /></div></div> */
  }

  return (
    <div className={`QuestionOptions QuestionOptions--${type}`}>
      {generateOptions()}
    </div>
  );
}


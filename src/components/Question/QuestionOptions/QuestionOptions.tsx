import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup } from "@material-ui/core";
import React from 'react';
import { useThemeSettings } from '../../../hooks';
import { TQuestionInputFull } from '../../../types';
import "./QuestionOptions.scss";

interface Props {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: TQuestionInputFull,
}

export default function QuestionOptions(props: Props) {
  const { theme } = useThemeSettings();
  const { changeOption, user_answers, question: { _id, type } } = props;
  const generateOptions = () => {
    switch (props.question.type) {
      case "MCQ": {
        return <RadioGroup className="QuestionOptions-container QuestionOptions-container--MCQ" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} onChange={e => changeOption([e.target.value])}>
          {props.question.options.map((option, i) => {
            return <div key={`${_id}option${i}`} className="QuestionOptions-container-item" style={{ backgroundColor: theme.color.base }}>
              <FormControlLabel
                control={<Radio color="primary" />}
                value={`${i}`}
                label={option}
                labelPlacement="end"
              />
            </div>
          })}
        </RadioGroup>
      }
      case "MS": {
        return <FormGroup className="QuestionOptions-container QuestionOptions-container--MS" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} onChange={(e: any) => {
          if (e.target.checked)
            changeOption(user_answers.concat(e.target.value))
          else
            changeOption(user_answers.filter(user_answer => user_answer !== e.target.value));
        }}>
          {props.question.options.map((option, i) => {
            return <div key={`${_id}option${i}`} className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }}>
              <FormControlLabel
                control={<Checkbox checked={user_answers.includes(`${i}`)} value={`${i}`} color="primary" />}
                label={option}
              /></div>
          })}
        </FormGroup>
      }
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


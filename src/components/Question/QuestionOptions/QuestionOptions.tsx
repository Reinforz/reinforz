import { Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup } from "@material-ui/core";
import React from 'react';
import { useThemeSettings } from '../../../hooks';
import { TQuestionInputFull } from '../../../types';
import "./QuestionOptions.scss";

interface Props {
  setUserAnswers: (val: string[]) => any,
  userAnswers: string[],
  question: TQuestionInputFull,
}

export default function QuestionOptions(props: Props) {
  const { theme } = useThemeSettings();
  const { setUserAnswers, userAnswers, question: { _id, type } } = props;
  const generateOptions = () => {
    switch (props.question.type) {
      case "MCQ": {
        return <RadioGroup className="QuestionOptions-container QuestionOptions-container--MCQ" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} defaultValue={undefined} value={userAnswers[0] === '' ? [''] : userAnswers[0]} onChange={e => setUserAnswers([e.target.value])}>
          {props.question.options.map((option, i) => {
            return <div key={`${_id}option${i}`} className="QuestionOptions-container-item" style={{ backgroundColor: theme.color.base }}>
              <FormControlLabel
                control={<Radio color="primary" />}
                value={`${i}`}
                label={option.text}
                labelPlacement="end"
              />
            </div>
          })}
        </RadioGroup>
      }
      case "MS": {
        return <FormGroup className="QuestionOptions-container QuestionOptions-container--MS" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} onChange={(e: any) => {
          if (e.target.checked)
            setUserAnswers(userAnswers.concat(e.target.value))
          else
            setUserAnswers(userAnswers.filter(user_answer => user_answer !== e.target.value));
        }}>
          {props.question.options.map((option, i) => {
            return <div key={`${_id}option${i}`} className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }}>
              <FormControlLabel
                control={<Checkbox checked={userAnswers.includes(`${i}`)} value={`${i}`} color="primary" />}
                label={option.text}
              /></div>
          })}
        </FormGroup>
      }
    }
  }

  return (
    <div className={`QuestionOptions QuestionOptions--${type}`}>
      {generateOptions()}
    </div>
  );
}


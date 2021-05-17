import { TextField } from "@material-ui/core";
import React from 'react';
import { useThemeSettings } from '../../../hooks';
import { TQuestionInputFull } from '../../../types';

interface Props {
  setUserAnswers: React.Dispatch<React.SetStateAction<string[]>>
  userAnswers: string[],
  question: TQuestionInputFull,
}

export default function QuestionInputs(props: Props) {
  const { theme } = useThemeSettings();
  const { setUserAnswers, userAnswers, question: { type } } = props;

  return (
    <div className={`QuestionInputs QuestionInputs--${type}`}>
      {props.question.answers.map((_, i) =>
        <div className="QuestionInputs-container" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}><div className={`QuestionInputs-container-item`} style={{ backgroundColor: theme.color.base }}>
          <TextField fullWidth value={userAnswers[i]} onChange={e => {
            userAnswers[i] = e.target.value;
            setUserAnswers([...userAnswers])
          }} /></div></div>
      )}
    </div>
  );
}


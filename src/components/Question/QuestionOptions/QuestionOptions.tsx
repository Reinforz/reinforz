import React, { useContext } from 'react';
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, TextField, useTheme } from "@material-ui/core";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useSound from 'use-sound';

import { ExtendedTheme, ISettings, QuestionOptionsProps } from '../../../types';

import SettingsContext from '../../../context/SettingsContext';

import "./QuestionOptions.scss";

export default function (props: QuestionOptionsProps) {
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;

  const [optionClick] = useSound(process.env.PUBLIC_URL + "/sounds/option-click.mp3", { volume: 0.15 });

  const { changeOption, user_answers, question: { _id, type, options } } = props;
  const generateOptions = () => {
    if (type === "MCQ" && options)
      return <RadioGroup className="QuestionOptions-container QuestionOptions-container--MCQ" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }} defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} onChange={e => changeOption([e.target.value])}>
        <TransitionGroup component={null}>
          {options.map((option, i) => (
            <CSSTransition key={`${_id}option${i}`} classNames={settings.animation ? "fade" : undefined} timeout={{ enter: i * 250 }} appear>
              <div className="QuestionOptions-container-item" style={{ backgroundColor: theme.color.base }}>
                <FormControlLabel
                  control={<Radio onClick={() => {
                    if (settings.sound) optionClick();
                  }} color="primary" />}
                  value={`${i}`}
                  label={option.toString()}
                  labelPlacement="end"
                />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
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
        <TransitionGroup component={null}>
          {options.map((option, i) => (
            <CSSTransition key={`${_id}option${i}`} classNames={settings.animation ? "fade" : undefined} timeout={{ enter: i * 250 }} appear>
              <div className={`QuestionOptions-container-item`} style={{ backgroundColor: theme.color.base }} key={`${_id}option${i}`}>
                <FormControlLabel
                  control={<Checkbox onClick={(e) => {
                    if (settings.sound) optionClick();
                  }} checked={temp_user_answers.includes(`${i}`)} value={`${i}`} color="primary" />}
                  label={option.toString()}
                /></div></CSSTransition>))}
        </TransitionGroup>
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


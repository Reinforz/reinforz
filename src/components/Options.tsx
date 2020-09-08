import React from 'react';
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox, TextField } from "@material-ui/core";
import styled from "styled-components";
import { QuestionInputFull } from '../types';

export const OptionsContainerItem = styled.div`
  padding: 5px;
  cursor: pointer;
  margin: 5px;
  width: 100%;
  background: #353232;
  border-radius: 5px;
  color: #ddd;
  display: flex;
  justify-content: flex-start;
  .MuiInputBase-root{
    color: #ddd;
  }
  .MuiTypography-body1{
    font-size: 1.25rem;
    font-weight: 500;
  }
  .MuiFormControlLabel-root{
    width: 100%;
    margin: 0px;
  }
`;

export const OptionsContainerOptionsStyle = `
  display: grid !important; 
  width: 100%;
  grid-template-columns: 1fr 1fr;
  background: #1b1b1b;
`;

export const OptionsContainerOptions = styled.div`
  ${OptionsContainerOptionsStyle}
`;

const OptionsContainerRadioGroup = styled(RadioGroup)`
  ${OptionsContainerOptionsStyle}
`;

const OptionsContainerFormGroup = styled(FormGroup)`
  ${OptionsContainerOptionsStyle}
`;

const OptionsContainer = styled.div`
  width: 100%;
`;

interface OptionsProps {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: QuestionInputFull,
}

function Options(props: OptionsProps) {
  const { changeOption, user_answers, question: { index, _id, type, options } } = props;
  const generateOptions = () => {
    if (type === "MCQ" && options)
      return <OptionsContainerRadioGroup className="Options-container" defaultValue={undefined} value={user_answers[0] === '' ? [''] : user_answers[0]} onChange={e => changeOption([e.target.value])} row>
        {options.map((option, i) => (
          <OptionsContainerItem key={`${_id}option${index}${i}`}>
            <FormControlLabel
              control={<Radio color="primary" />}
              value={`${i}`}
              label={option.toString()}
              labelPlacement="end"
            />
          </OptionsContainerItem>
        ))}
      </OptionsContainerRadioGroup>
    else if (type === "MS" && options) {
      const temp_user_answers = [...(user_answers as string[])];
      return <OptionsContainerFormGroup row onChange={(e: any) => {
        if (e.target.checked) {
          temp_user_answers.push(e.target.value);
          changeOption([...temp_user_answers])
        }
        else
          changeOption(temp_user_answers.filter(temp_user_answer => temp_user_answer !== e.target.value));
      }}>
        {options.map((option, i) => (
          <OptionsContainerItem className={`Options-container-item`} key={`${_id}option${index}${i}`}>
            <FormControlLabel
              control={<Checkbox checked={temp_user_answers.includes(`${i}`)} value={`${i}`} />}
              label={option.toString()}
            /></OptionsContainerItem>))}
      </OptionsContainerFormGroup>
    }

    else if (type === "Snippet")
      return <OptionsContainerItem className={`Options-container-item`}>
        <TextField fullWidth value={user_answers[0]} onChange={e => {
          user_answers[0] = e.target.value;
          changeOption([...user_answers])
        }} /></OptionsContainerItem>
  }

  return (
    <OptionsContainer className="Options">
      {generateOptions()}
    </OptionsContainer>
  );
}

export default Options;
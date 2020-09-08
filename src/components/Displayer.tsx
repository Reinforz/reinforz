import styled from "styled-components";
import React from 'react';

import { QuestionInputFull } from "../types";

interface DisplayerProps {
  changeOption: (val: string[]) => any,
  user_answers: string[],
  question: QuestionInputFull,
}

function Displayer(props: DisplayerProps) {
  return (
    <div>

    </div>
  );
}

export default Displayer;

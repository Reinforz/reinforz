import React from 'react';
import styled from "styled-components";

import Table from "./Table";
import {Result} from "../types";

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function Report(props: {results: Result[]}) {
  return (
    <div className="Report">
      <ReportContainer className="Report-container">
        <Table contents={props.results} headers={["question","type","verdict","score","time_allocated","time_taken","answers","user_answers"]} keycreator={({answers},index)=>answers.join("")+index}/>
      </ReportContainer>
    </div>
  );
}

export default Report;
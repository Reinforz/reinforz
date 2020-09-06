import React from 'react';
import styled from "styled-components";

import Table from "./Table";
import { Result } from "../types";

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function Report(props: { results: Result[] }) {
  const transformValue = (header: string, value: any) => {
    if (header !== "verdict") return value?.toString() ?? "N/A";
    else
      return <div style={{
        fontWeight: 'bolder', color: value === false ? "#ff3223" : "#36e336"
      }}>{value === false ? "Incorrect" : "Correct"}</div>
  }
  return (
    <div className="Report">
      <ReportContainer className="Report-container">
        <Table transformValue={transformValue} contents={props.results} collapseContents={["explanation"]} headers={["question", "type", "verdict", "score", "time_allocated", "time_taken", "answers", "user_answers"]} keycreator={({ answers }, index) => answers.join("") + index} />
      </ReportContainer>
    </div>
  );
}

export default Report;
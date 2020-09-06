import React from 'react';
import styled from "styled-components";

import Table from "./Table";
import { Result } from "../types";

const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function Report(props: { results: Result[] }) {
  const transformValue = (header: string, content: any) => {
    const value = content[header];
    switch (header) {
      case "verdict":
        return <div style={{
          fontWeight: 'bolder', color: value === false ? "#ff3223" : "#36e336"
        }}>{value === false ? "Incorrect" : "Correct"}</div>
      case "answers":
      case "user_answers":
        if (content.type.match(/(MS|FIB)/))
          return value.map((value: any, index: number) => <div key={value + index}>{value.replace(/^_(\w{2}\s?)*_/g, '')}</div>);
        else return value
      default:
        return value?.toString() ?? "N/A";
    }
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
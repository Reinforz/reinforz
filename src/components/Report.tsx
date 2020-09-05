import React from 'react';

import {Result} from "../types";

function Report(props: {results: Result[]}) {
  console.log(props.results)
  return (
    <div className="Report">
      {props.results.map((result,index)=><div key={result.user_answers.join("")+index}>{result.verdict}</div>)}
    </div>
  );
}

export default Report;
import React from 'react';

import {Result} from "../types";

function Report(props: {results: Result[]}) {
  return (
    <div className="Report">
      {props.results.map(result=><div>{result.verdict}</div>)}
    </div>
  );
}

export default Report;
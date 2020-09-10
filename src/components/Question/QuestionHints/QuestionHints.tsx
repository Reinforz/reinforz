import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import "./QuestionHints.scss";

interface HintsProps {
  hints: string[],
  children: any
}

export default function (props: HintsProps) {
  const [hints_used, setHintsUsed] = useState(0);
  const { hints, children } = props;

  return (
    children({
      QuestionHints: <div className="QuestionHints">
        <div className="QuestionHints-list">
          {Array(hints_used).fill(0).map((_, i) => <div key={"hint" + i} className="QuestionHints-list-item">Hint {i + 1}: {hints[i]}</div>)}
        </div>
        <Button color="primary" className="QuestionHints-button" onClick={() => hints_used < hints.length ? setHintsUsed(hints_used + 1) : void 0}>{hints.length > 0 ? `Show hint ${hints_used}/${hints.length}` : `No hints available`}</Button>,
      </div>,
      hints_state: {
        hints_used
      }
    })
  );
}
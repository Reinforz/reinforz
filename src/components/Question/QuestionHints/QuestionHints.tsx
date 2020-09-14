import React, { useState } from 'react';
import { Button, useTheme } from '@material-ui/core';

import { QuestionHintsProps, QuestionHintsRProps, ExtendedTheme } from '../../../types';

import "./QuestionHints.scss";

export default function (props: QuestionHintsProps) {
  const [hints_used, setHintsUsed] = useState(0);
  const { hints, children } = props;
  const theme = useTheme() as ExtendedTheme;

  return (
    children({
      QuestionHintsComponent: <div className="QuestionHints">
        <Button color="primary" variant="contained" className="QuestionHints-button" onClick={() => hints_used < hints.length ? setHintsUsed(hints_used + 1) : void 0}>{hints.length > 0 ? `Show hint ${hints_used}/${hints.length}` : `No hints available`}</Button>
        <div className="QuestionHints-list" >
          {Array(hints_used).fill(0).map((_, i) => <div key={"hint" + i} style={{ backgroundColor: theme.color.dark }} className="QuestionHints-list-item">Hint {i + 1}: {hints[i]}</div>)}
        </div>
      </div>,
      QuestionHintsState: {
        hints_used
      }
    } as QuestionHintsRProps)
  );
}
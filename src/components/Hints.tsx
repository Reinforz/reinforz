import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styled from "styled-components";

interface HintsProps {
  hints: string[],
  children: any
}

const HintsList = styled.div`
  background: #1b1b1b;
  border-radius: 5px;
`;

const HintsListItem = styled.div`
  padding: 5px 50px;
  font-size: 1.25em;
  font-weight: bolder;
  color: #2196f3;
  margin: 5px;
`

function Hints(props: HintsProps) {
  const [hints_used, setHintsUsed] = useState(0);
  const { hints, children } = props;

  return (
    children({
      HintsButton: <Button color="primary" className="Hints-button" onClick={() => hints_used < hints.length ? setHintsUsed(hints_used + 1) : void 0}>{hints.length > 0 ? `Show hint ${hints_used}/${hints.length}` : `No hints available`}</Button>,
      HintsList: <HintsList className="Hints-list">
        {Array(hints_used).fill(0).map((_, i) => <HintsListItem key={"hint" + i} className="Hints-list-item">Hint {i + 1}: {hints[i]}</HintsListItem>)}
      </HintsList>,
      hints_state: {
        hints_used
      }
    })
  );
}

export default Hints;
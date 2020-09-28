import React from 'react';

import { QuestionHintsProps, QuestionHintsRProps, ToggleItemsRProps } from '../../../types';

import "./QuestionHints.scss";

import ToggleItems from '../../Basic/ToggleItems';

export default function (props: QuestionHintsProps) {
  const { hints, children } = props;
  return <ToggleItems items={hints} name={"hints"}>
    {({ ToggleButton, ToggleItems, ToggleItemsState }: ToggleItemsRProps) => {
      return children({
        QuestionHintsComponent: <div className="QuestionHints">
          {ToggleButton}
          {ToggleItems}
        </div>,
        QuestionHintsState: {
          hints_used: ToggleItemsState.current_index
        }
      }) as QuestionHintsRProps
    }}
  </ToggleItems>
}
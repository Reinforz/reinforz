import React from 'react';
import { Toggle } from '../../../shared';
import { QuestionHintsProps, QuestionHintsRProps, ToggleItemsRProps } from '../../../types';
import "./QuestionHints.scss";

export default function QuestionHints(props: QuestionHintsProps) {
  const { hints, children } = props;
  return <Toggle items={hints} name={"hints"}>
    {({ ToggleButton, ToggleItems, ToggleItemsState, ToggleItemsUtils }: ToggleItemsRProps) => {
      return children({
        QuestionHintsComponent: <div className="QuestionHints">
          {ToggleButton}
          {ToggleItems}
        </div>,
        QuestionHintsState: {
          hints_used: ToggleItemsState.current_index,
        },
        QuestionHintsUtils: {
          ...ToggleItemsUtils
        }
      }) as QuestionHintsRProps
    }}
  </Toggle>
}
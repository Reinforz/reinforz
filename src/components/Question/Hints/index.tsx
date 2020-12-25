import React from 'react';

import { ToggleItemsRenderProps } from '../../../types';

import "./style.scss";

import ToggleItems from '../../Basic/ToggleItems';
import { QuestionHintsProps, QuestionHintsRenderProps } from './types';

export function QuestionHints(props: QuestionHintsProps) {
  const { hints, children } = props;
  return <ToggleItems items={hints} name={"hints"}>
    {({ ToggleButton, ToggleItems, ToggleItemsState, ToggleItemsUtils }: ToggleItemsRenderProps) => {
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
      }) as QuestionHintsRenderProps
    }}
  </ToggleItems>
}

export * from "./types"
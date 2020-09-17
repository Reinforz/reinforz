import React, { useState, useContext } from 'react';
import { Button, useTheme } from '@material-ui/core';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { QuestionHintsProps, QuestionHintsRProps, ExtendedTheme, ISettings } from '../../../types';

import "./QuestionHints.scss";

import SettingsContext from '../../../context/SettingsContext';

export default function (props: QuestionHintsProps) {
  const [hints_used, setHintsUsed] = useState(0);
  const { hints, children } = props;
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;

  return (
    children({
      QuestionHintsComponent: <div className="QuestionHints">
        <Button color="primary" variant="contained" className="QuestionHints-button" onClick={() => hints_used < hints.length ? setHintsUsed(hints_used + 1) : void 0}>{hints.length > 0 ? `Show hint ${hints_used}/${hints.length}` : `No hints available`}</Button>
        <div className="QuestionHints-list" >
          <TransitionGroup component={null}>
            {Array(hints_used).fill(0).map((_, i) =>
              <CSSTransition key={`hint${i}`} classNames={settings.animation ? "fade" : undefined} timeout={{ enter: i * 250 }} appear>
                <div key={"hint" + i} style={{ backgroundColor: theme.color.dark }} className="QuestionHints-list-item">Hint {i + 1}: {hints[i]}</div></CSSTransition>)}
          </TransitionGroup>
        </div>
      </div>,
      QuestionHintsState: {
        hints_used
      }
    } as QuestionHintsRProps)
  );
}
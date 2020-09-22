import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTheme } from '@material-ui/core';

import useCycle from "../../hooks/useCycle";
import useDisabled from "../../hooks/useDisabled";

import SettingsContext from "../../context/SettingsContext";

import { ExtendedTheme, ISettings } from "../../types";

export default function (props: { items: string[], name: string, children: any }) {
  const { items, name, children } = props;
  const { hasEnded, getNextIndex, current_index } = useCycle(items);
  const { is_disabled, disable } = useDisabled(2500);

  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;

  return children({
    ToggleButton: <Button disabled={is_disabled || hasEnded} color="primary" variant="contained" className="ToggleItems-button" onClick={() => {
      if (!hasEnded) {
        getNextIndex()
        disable()
      }
    }}>{items.length > 0 ? `Show ${name || "item"} ${current_index}/${items.length}` : `No ${name || "items"} available`}</Button>,
    ToggleItems: <div className="ToggleItems-items" >
      <TransitionGroup component={null}>
        {Array(current_index).fill(0).map((_, i) =>
          <CSSTransition key={`hint${i}`} classNames={settings.animation ? "fade" : undefined} timeout={{ enter: i * 250 }} appear>
            <div key={"hint" + i} style={{ backgroundColor: theme.color.dark }} className="ToggleItems-list-item">{(name || "item").charAt(0).toUpperCase() + (name || "item").substr(1)} {i + 1}: {items[i]}</div></CSSTransition>)}
      </TransitionGroup>
    </div>,
    ToggleItemsState: {
      current_index,
      is_disabled
    }
  })
}
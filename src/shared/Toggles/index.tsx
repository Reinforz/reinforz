import { FormGroup, InputLabel, Switch, withStyles } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import clsx from "clsx";
import React from 'react';
import { useThemeSettings } from '../../hooks';

const OnOffSwitch = withStyles({
  switchBase: {
    color: red[500],

    '&$checked': {
      color: green[500],
    },
    '&$checked + $track': {
      backgroundColor: green[500],
    },
  },
  'track': {
    backgroundColor: red[500],
  },
  checked: {},
})(Switch);

interface Props<I extends Record<string, any>> {
  items: (keyof I)[]
  itemsMap: I
  setItems: (item: I) => void
  sound?: boolean
  classNames?: {
    FormGroup?: string
    InputLabel?: string
  }
}

export default function Toggles<I extends Record<string, any>>(props: Props<I>) {
  const { theme: THEME, sounds: { switch_on, switch_off } } = useThemeSettings();
  const { sound, items, itemsMap, setItems } = props;
  return <> {items.map((item) =>
    <FormGroup row className={clsx("Toggles-item", props?.classNames?.FormGroup && props.classNames.FormGroup)} style={{ backgroundColor: THEME.color.base }}>
      <InputLabel className={clsx("Toggles-item-label", props?.classNames?.InputLabel && props.classNames.InputLabel)}>{(item as string).charAt(0).toUpperCase() + (item as string).substr(1)}</InputLabel>
      <OnOffSwitch
        checked={itemsMap[item]}
        onChange={(e) => {
          if (!itemsMap[item] && sound) switch_on.play();
          else if (itemsMap[item] && sound) switch_off.play();
          setItems({ ...itemsMap, [item]: !itemsMap[item] })
        }}
      />
    </FormGroup>
  )}
  </>
}
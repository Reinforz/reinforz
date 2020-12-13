import React from 'react';
import { red, green } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/styles";
import { OnoffSwitchProps } from './types';
import { Switch } from '@material-ui/core';

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

export function OnoffSwitch(props: OnoffSwitchProps) {
  return <OnOffSwitch {...props} />
}

export * from "./types"
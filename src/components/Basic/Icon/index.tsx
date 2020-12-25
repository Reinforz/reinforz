import React, { Fragment, useContext, useEffect } from 'react';
import { Popover, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SettingsProps } from '../../Settings';
import { IconProps } from './types';
import { SettingsContext } from "../../../context"

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export function Icon(props: IconProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { settings } = useContext(SettingsContext) as SettingsProps;

  const open = Boolean(anchorEl);

  const {
    className,
    popoverText,
    children
  } = props;

  useEffect(() => {
    return () => {
      setAnchorEl(null)
    }
  }, [])

  return settings.hovertips ? <Fragment>
    <span className={`${className ? className + ' ' : ''}icon`} style={{ display: "flex" }} onMouseEnter={(e: any) => setAnchorEl(e.currentTarget)} onMouseLeave={() => setAnchorEl(null)}>{children}</span>
    {<Popover className={classes.popover}
      classes={{
        paper: classes.paper,
      }} open={open} anchorEl={anchorEl} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      onClose={() => setAnchorEl(null)} disableRestoreFocus ><Typography>{popoverText}</Typography></Popover>}
  </Fragment> : children
}

export * from "./types"
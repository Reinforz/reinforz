import { Popover, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useContext, useEffect } from 'react';
import SettingsContext from '../../context/SettingsContext';
import { ISettings } from '../../types';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export interface IconProps {
  className?: string,
  popoverText: string,
  children: JSX.Element
}

export default function (props: IconProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const settings = useContext(SettingsContext) as ISettings;

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
import React, { Fragment, useContext, useEffect } from 'react';
import { Popover, SvgIconTypeMap, Typography } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { makeStyles } from '@material-ui/core/styles';

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
  onClick: (e: any) => any,
  style?: any,
  popoverText: string,
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>,
  key?: string
}

export default function (props: IconProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const settings = useContext(SettingsContext) as ISettings;

  const open = Boolean(anchorEl);

  const {
    className,
    onClick,
    style = {},
    popoverText,
    icon,
  } = props;

  useEffect(() => {
    return () => {
      setAnchorEl(null)
    }
  }, [])

  const Icon = React.createElement(icon, {
    className: `${className ? className + ' ' : ''}icon`,
    onClick: (e: any) => onClick && onClick(e),
    style,
    onMouseEnter: (e: any) => setAnchorEl(e.currentTarget),
    onMouseLeave: () => setAnchorEl(null)
  });

  return settings.hovertips ? <Fragment>
    {Icon}
    {Icon && style.display !== "none" && <Popover className={classes.popover}
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
  </Fragment> : Icon
}
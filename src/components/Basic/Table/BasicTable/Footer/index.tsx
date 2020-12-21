import React from 'react';
import { TableFooter, TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

import "./style.scss";
import { BasicTableFooterProps } from "./types";
import { ExtendedTheme } from "../../../../../types"
import { useThemeSettings } from '../../../../../hooks';

const useStyles = makeStyles((theme: ExtendedTheme) => ({
  th: {
    fontWeight: 'bolder',
    fontSize: '1rem',
    userSelect: "none",
    borderBottom: 0,
    textAlign: 'center',
    backgroundColor: theme.color.dark,
    padding: "15px 0px"
  },
}));

export function BasicTableFooter(props: BasicTableFooterProps) {
  const { theme } = useThemeSettings();
  const classes = useStyles();
  const accumulator: Record<string, Array<any>> = {};
  props.headers.forEach(header => {
    accumulator[header] = [];
    props.contents.forEach(content => accumulator[header].push(content[header]))
  });

  return <TableFooter className="Table-footer" style={{ backgroundColor: theme.color.dark }}>
    <TableRow>
      {props.collapseContents && <TableCell className={classes.th}></TableCell>}
      <TableCell className={classes.th}>{props.contents.length}</TableCell>
      {props.headers.map((header, index) => <TableCell className={classes.th} key={header + "footer" + index} align="center">{props.accumulator(header, accumulator[header])?.toString() ?? "N/A"}</TableCell>)}
    </TableRow>
  </TableFooter>
}

export * from "./types"
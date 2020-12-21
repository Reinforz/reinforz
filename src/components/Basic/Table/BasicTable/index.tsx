import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { TableFooter, TableRow } from '@material-ui/core';

import { useThemeSettings } from '../../../../hooks';

import { ExtendedTheme } from "../../../../types"

import "./style.scss";

import { BasicTableProps } from './types';
import { BasicTableHeader } from './Header';
import { BasicTableBody } from './Body';

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

export const BasicTable = React.memo((props: BasicTableProps<Record<string, any>>) => {
  const classes = useStyles();
  const accumulator: Record<string, Array<any>> = {};
  const { theme } = useThemeSettings();
  props.headers.forEach(header => {
    accumulator[header] = [];
    props.contents.forEach(content => accumulator[header].push(content[header]))
  });

  return (
    <TableContainer component={Paper} className={`Table ${props.className || ''}`}>
      <Table stickyHeader>
        <BasicTableHeader headers={props.headers} collapseContents={props.collapseContents} onHeaderClick={props.onHeaderClick} />
        <BasicTableBody transformValue={props.transformValue} collapseContents={props.collapseContents} contents={props.contents} headers={props.headers} />
        <TableFooter className="Table-footer" style={{ backgroundColor: theme.color.dark }}>
          <TableRow>
            {props.collapseContents && <TableCell className={classes.th}></TableCell>}
            <TableCell className={classes.th}>{props.contents.length}</TableCell>
            {props.headers.map((header, index) => <TableCell className={classes.th} key={header + "footer" + index} align="center">{props.accumulator(header, accumulator[header])?.toString() ?? "N/A"}</TableCell>)}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}, ((prevProp, currentProp) => prevProp.contents.length === currentProp.contents.length))

export * from "./types"
import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Collapse from '@material-ui/core/Collapse';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TableFooter } from '@material-ui/core';
import marked from "marked";
import createDOMPurify from 'dompurify';

import { Icon } from "../..";

import { useThemeSettings } from '../../../../hooks';

import { TableRowsProps, ExtendedTheme } from "../../../../types"

import "./style.scss";

import { BasicTableProps } from './types';
import { BasicTableHeaders } from './Header';

const DOMPurify = createDOMPurify(window);

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
  td: {
    fontWeight: 500,
    userSelect: "none",
    borderBottom: 0,
    textAlign: 'center'
  },
  tr: {
    borderBottom: 0
  }
}));

function TableRows(props: TableRowsProps) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { title, content, headers, index, collapseContents, transformValue } = props;
  const { theme } = useThemeSettings();

  return <Fragment>
    {title && <div className="Table-title">{title}</div>}
    <TableRow className={classes.tr} >
      {collapseContents && <TableCell className={classes.td}>
        <Icon popoverText="Click to show explanation" >
          <KeyboardArrowUpIcon onClick={() => setOpen(!open)} style={{ display: !open ? "initial" : "none", color: theme.color.opposite_dark }} />
        </Icon>
        <Icon popoverText="Click to hide explanation" >
          <KeyboardArrowDownIcon onClick={() => setOpen(!open)} style={{ display: open ? "initial" : "none", color: theme.color.opposite_dark }} />
        </Icon>
      </TableCell>}
      <TableCell className={classes.td}>{index + 1}</TableCell>
      {headers.map((header, index) => <TableCell className={classes.td} key={header + 'row' + index} align="center">{transformValue ? transformValue(header, content) : content[header]?.toString() ?? "N/A"}</TableCell>)}
    </TableRow>
    {collapseContents && <TableRow className={classes.tr}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length} className={classes.td}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {collapseContents.map((collapseContent, collapseContentIndex) => <div key={index + "collapse" + collapseContent + collapseContentIndex}>
            <div className="Table-row-collapseheader">
              {collapseContent}
            </div>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(content[collapseContent].toString())) }} className="Table-row-collapsecontent" />
          </div>)}
        </Collapse>
      </TableCell>
    </TableRow>}
  </Fragment>
}



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
        <TableHead className="Table-header" style={{ backgroundColor: theme.color.dark }}>
          <BasicTableHeaders headers={props.headers} collapseContents={props.collapseContents} onHeaderClick={props.onHeaderClick} />
        </TableHead>
        <TableBody className="Table-body" style={{ backgroundColor: theme.color.base }}>
          {props.contents.map((content, index) => <TableRows transformValue={props.transformValue} collapseContents={props.collapseContents} key={content._id} content={content} headers={props.headers} index={index} />)}
        </TableBody>
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
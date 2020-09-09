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
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TableFooter } from '@material-ui/core';

const useStyles = makeStyles({
  th: {
    fontWeight: 'bolder',
    fontSize: '1rem',
    userSelect: "none",
    borderBottom: 0,
    textAlign: 'center'
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
});

interface Table_RowCommonProps {
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  title?: string
}
interface TableProps<Values> extends Table_RowCommonProps {
  contents: Values[],
  accumulator: (header: string, contents: Array<any>) => string | null | number,
  className?: string
}

interface RowProps extends Table_RowCommonProps {
  content: any,
  index: number,
}

function Rows(props: RowProps) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { title, content, headers, index, collapseContents, transformValue } = props;
  return <Fragment>
    {title && <div className="Table-title">{title}</div>}
    <TableRow className={classes.tr} >
      {collapseContents && <TableCell className={classes.td}>
        <IconButton aria-label="expand row" size="small" style={{ color: 'white' }} onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>}
      <TableCell className={classes.td}>{index + 1}</TableCell>
      {headers.map((header, index) => <TableCell className={classes.td} key={header + 'row' + index} align="center">{transformValue ? transformValue(header, content) : content[header]?.toString() ?? "N/A"}</TableCell>)}
    </TableRow>
    {collapseContents && <TableRow className={classes.tr}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length} className={classes.td}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {collapseContents.map((collapseContent, collapseContentIndex) => <div key={index + "collapse" + collapseContent + collapseContentIndex}>
            <div style={{ margin: 5, textTransform: "capitalize" }}>
              {collapseContent}
            </div>
            <div>
              {content.explanation}
            </div>
          </div>)}
        </Collapse>
      </TableCell>
    </TableRow>}
  </Fragment>
}


export default function SimpleTable(props: TableProps<Record<string, any>>) {
  const classes = useStyles();
  const accumulator: Record<string, Array<any>> = {};
  props.headers.forEach(header => {
    accumulator[header] = [];
    props.contents.forEach(content => accumulator[header].push(content[header]))
  });
  return (
    <TableContainer component={Paper} className={`Table ${props.className || ''}`}>
      <Table stickyHeader>
        <TableHead className="Table-header">
          <TableRow className={classes.tr}>
            {props.collapseContents && <TableCell className={classes.th}></TableCell>}
            <TableCell className={classes.th}>No.</TableCell>
            {props.headers.map((header, index) => <TableCell className={classes.th} key={header + "header" + index} align="center">{header.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contents.map((content, index) => <Rows transformValue={props.transformValue} collapseContents={props.collapseContents} key={content._id} content={content} headers={props.headers} index={index} />)}
        </TableBody>
        <TableFooter>
          <TableRow>
            {props.collapseContents && <TableCell className={classes.th}></TableCell>}
            <TableCell className={classes.th}>{props.contents.length}</TableCell>
            {props.headers.map((header, index) => <TableCell className={classes.th} key={header + "footer" + index} align="center">{props.accumulator(header, accumulator[header])?.toString() ?? "N/A"}</TableCell>)}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

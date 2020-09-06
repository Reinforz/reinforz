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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  th: {
    fontWeight: 'bolder',
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

interface TableProps<Values> {
  contents: Values[],
  keycreator: (data: Values, index: number) => string,
  headers: string[],
  collapseContents: string[]
}

interface RowProps {
  content: any,
  index: number,
  headers: string[],
  collapseContents: string[],
}

function Rows(props: RowProps) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { content, headers, index, collapseContents } = props;
  return <Fragment>
    <TableRow className={classes.root}>
      <TableCell>
        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell>{index + 1}</TableCell>
      {headers.map((header, index) => <TableCell key={header + 'row' + index} align="center">{content[header]?.toString() ?? "N/A"}</TableCell>)}
    </TableRow>
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {collapseContents.map((collapseContent, collapseContentIndex) => <div key={index + "collapse" + collapseContent + collapseContentIndex}>
            <div>
              {collapseContent}
            </div>
            <div>
              {content.explanation}
            </div>
          </div>)}
        </Collapse>
      </TableCell>
    </TableRow>
  </Fragment>
}


export default function SimpleTable(props: TableProps<Record<string, any>>) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead >
          <TableRow>
            <TableCell className={classes.th}>No.</TableCell>
            {props.headers.map((header, index) => <TableCell className={classes.th} key={header + index} align="center">{header.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contents.map((content, index) => <Rows collapseContents={props.collapseContents} key={props.keycreator(content, index)} content={content} headers={props.headers} index={index} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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
    backgroundColor: '#1f1f1f',
    fontSize: '1.15rem',
    color: "rgba(255,255,255,0.75)",
    userSelect: "none",
    borderBottom: 0,
  },
  td: {
    backgroundColor: "#2c2c2c",
    color: "#dddddd",
    fontWeight: 500,
    userSelect: "none",
    borderBottom: 0
  },
  tr: {
    borderBottom: 0
  }
});

interface Table_RowCommonProps {
  collapseContents: string[]
  transformValue: (header: string, value: any) => string
  headers: string[],

}
interface TableProps<Values> extends Table_RowCommonProps {
  contents: Values[],
  keycreator: (data: Values, index: number) => string,
}

interface RowProps extends Table_RowCommonProps {
  content: any,
  index: number,
}

function Rows(props: RowProps) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { content, headers, index, collapseContents, transformValue } = props;
  return <Fragment>
    <TableRow className={classes.tr} >
      <TableCell className={classes.td}>
        <IconButton aria-label="expand row" size="small" style={{ color: 'white' }} onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell className={classes.td}>{index + 1}</TableCell>
      {headers.map((header, index) => <TableCell className={classes.td} key={header + 'row' + index} align="center">{transformValue(header, content[header])}</TableCell>)}
    </TableRow>
    <TableRow className={classes.tr}>
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
    </TableRow>
  </Fragment>
}


export default function SimpleTable(props: TableProps<Record<string, any>>) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead >
          <TableRow className={classes.tr}>
            <TableCell className={classes.th}></TableCell>
            <TableCell className={classes.th}>No.</TableCell>
            {props.headers.map((header, index) => <TableCell className={classes.th} key={header + index} align="center">{header.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contents.map((content, index) => <Rows transformValue={props.transformValue} collapseContents={props.collapseContents} key={props.keycreator(content, index)} content={content} headers={props.headers} index={index} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

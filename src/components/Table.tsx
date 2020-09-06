import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface TableProps {
  contents: Record<string,any>[],
  keycreator: (data:Record<string,any>,index: number) => string
}

export default function SimpleTable(props: TableProps) {
  const classes = useStyles();
  const headers = Object.keys(props.contents[0]);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            {headers.map((header,index)=><TableCell key={header+index} align="center">{header.split("_").map(c=>c.charAt(0).toUpperCase()+c.substr(1)).join(" ")}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.contents.map((content,index) => {
            const key=props.keycreator(content,index);
            return <TableRow key={key}>
              <TableCell>{index+1}</TableCell>
              {headers.map((header,index)=><TableCell key={key+header+index} align="center">{content[header].toString() || "N/A"}</TableCell>)}
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

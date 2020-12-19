import { TableRow, TableCell } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MdPlayArrow } from "react-icons/md";

import { BasicTableHeaderProps } from "./types";
import { ExtendedTheme } from '../../../../../types';

import "./style.scss";

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
  tr: {
    borderBottom: 0
  }
}));

export function BasicTableHeaders(props: BasicTableHeaderProps) {
  const [headers_sort_orders, setHeadersSortOrders] = useState(Array(props.headers.length).fill("").map(() => "ASC") as ("ASC" | "DESC")[])
  const classes = useStyles();
  return <TableRow className={classes.tr}>
    {props.collapseContents && <TableCell style={{ cursor: "pointer" }} className={classes.th}></TableCell>}
    <TableCell style={{ cursor: "pointer" }} className={classes.th}>No.</TableCell>
    {props.headers.map((header, index) =>
      <TableCell style={{ cursor: "pointer" }} onClick={() => {
        headers_sort_orders[index] = headers_sort_orders[index] === "ASC" ? "DESC" : "ASC"
        setHeadersSortOrders([...headers_sort_orders])
        props.onHeaderClick && props.onHeaderClick(header, headers_sort_orders[index])
      }} className={classes.th} key={header + "header" + index} align="center">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content"
        }}>
          <MdPlayArrow style={{ transform: `rotateZ(${headers_sort_orders[index] === "ASC" ? 30 : -30}deg)` }} />
          {header.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")}
        </div>
      </TableCell>
    )}
  </TableRow>
}

export * from "./types"
import React, { Fragment } from 'react';
import Collapse from '@material-ui/core/Collapse';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TableCell } from '@material-ui/core';
import marked from "marked";
import createDOMPurify from 'dompurify';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';

import { BasicTableBodyProps } from "./types";
import { useThemeSettings } from '../../../../../hooks';
import { Icon } from "../../../"

const useStyles = makeStyles(() => ({
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

const DOMPurify = createDOMPurify(window);

export function BasicTableBody(props: BasicTableBodyProps) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { title, contents, headers, collapseContents, transformValue } = props;
  const { theme } = useThemeSettings();

  return <TableBody className="Table-body" style={{ backgroundColor: theme.color.base }}>
    {contents.map((content, index) =>
      <Fragment>
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
      </Fragment>)}
  </TableBody>
}

export * from "./types"
import React from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

import "./style.scss";

import { BasicTableProps } from './types';
import { BasicTableHeader } from './Header';
import { BasicTableBody } from './Body';
import { BasicTableFooter } from './Footer';

export const BasicTable = React.memo((props: BasicTableProps<Record<string, any>>) => {

  return (
    <TableContainer component={Paper} className={`Table ${props.className || ''}`}>
      <Table stickyHeader>
        <BasicTableHeader  {...props} />
        <BasicTableBody {...props} />
        <BasicTableFooter {...props} />
      </Table>
    </TableContainer>
  );
}, ((prevProp, currentProp) => prevProp.contents.length === currentProp.contents.length))

export * from "./types"
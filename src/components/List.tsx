import React from "react";
import styled from "styled-components";
import CancelIcon from '@material-ui/icons/Cancel';

const List = styled.div`
  display:flex;
  padding: 5px;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  margin: 5px;
`;

const ListItemField = styled.div`
  margin: 5px;
  font-size: 1.15rem;
`;

const CancelIconW = styled(CancelIcon)`
  margin: 5px;
  cursor: pointer;
  fill: #F44336 !important;
  transition: transform 200ms ease-in-out;
  &:hover{
    transform: scale(1.15);
    transition: transform 200ms ease-in-out;
  }
`;

interface ListProps<T> {
  items: T[],
  fields: (string | ((data: T) => string))[],
  setItems: (data: T[]) => any
}

export default function (props: ListProps<Record<string, any>>) {
  return <List className="List">
    {props.items.map(item => {
      return <ListItem key={item._id}>
        <CancelIconW onClick={() => {
          const items = props.items.filter(_item => _item._id !== item._id);
          props.setItems([...items]);
        }}/>
        {props.fields.map((field, index) => <ListItemField key={item._id + field + index}>{typeof field === "string" ? item[field] : field(item)}</ListItemField>)}
      </ListItem>
    })}
  </List>
}
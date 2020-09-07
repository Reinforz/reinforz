import React from "react";
import styled from "styled-components";

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

interface ListProps {
  items: any[],
  fields: string[]
}

export default function (props: ListProps) {
  return <List className="List">
    {props.items.map(item => {
      return <ListItem key={item._id}>
        {props.fields.map((field, index) => <ListItemField key={item._id + field + index}>{item[field]}</ListItemField>)}
      </ListItem>
    })}
  </List>
}
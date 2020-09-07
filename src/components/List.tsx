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

interface ListProps<T> {
  items: T[],
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: number) => void)[]
}

export default function (props: ListProps<Record<string, any>>) {
  return <List className="List">
    {props.items.map((item, index) => {
      return <ListItem key={item._id}>
        {props?.icons?.map(icon => icon(index, item._id))}
        {props.fields.map((field, index) => <ListItemField key={item._id + field + index}>{typeof field === "string" ? item[field] : field(item)}</ListItemField>)}
      </ListItem>
    })}
  </List>
}
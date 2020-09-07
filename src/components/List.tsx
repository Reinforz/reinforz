import React from "react";
import styled from "styled-components";

const List = styled.div`
  display:flex;
  padding: 5px;
  flex-direction: column;
`;

const ListHeader = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.25em;
  font-weight: bold;
  background: #161616;
  padding: 10px 0px;
`;

const ListContent = styled.div`
  padding: 5px;
  height: 550px;
  margin: 5px;
  overflow: auto;
  background: #373737;
  position: relative;
`;

const ListContentItem = styled.div`
  display: flex;
  margin: 5px;
  align-items: center;
`;

const ListContentItemField = styled.div`
  margin: 5px;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
`;

interface ListProps<T> {
  items: T[],
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: number) => void)[],
  header: string
}

export default function (props: ListProps<Record<string, any>>) {
  return <List className="List">
    <ListHeader className="List-header">{props.header}</ListHeader>
    <ListContent className="List-content">
      {props.items.length > 0 ? props.items.map((item, index) => {
        return <ListContentItem key={item._id}>
          {props?.icons?.map(icon => icon(index, item._id))}
          {props.fields.map((field, index) => <ListContentItemField key={item._id + field + index}>{typeof field === "string" ? item[field] : field(item)}</ListContentItemField>)}
        </ListContentItem>
      }) : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%" }}>No quizzes uploaded</div>}
    </ListContent>
  </List>
}
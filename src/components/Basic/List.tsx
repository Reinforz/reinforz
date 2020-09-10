import React, { useState } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import styled from 'styled-components';

import "./List.scss";

const List = styled.div`
  display:flex;
  padding: 5px;
  flex-direction: column;
`;

const ListHeader = styled.div`
  width: 100%;
  background: #161616;
  display: flex;
  align-items: center;
`;

const ListHeaderTitle = styled.div`
  font-size: 1.25em;
  font-weight: bold;
  padding: 10px 0px;
  text-align: center;
  margin: 0 auto;
`

const ListContent = styled.div`
  height: calc(100% - 25px);
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

const ListHeaderIcons = styled.div`
  display: flex;
`
interface ListProps<T> {
  items: T[],
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: string) => void)[],
  header: string,
  setItems: (data: T[]) => void,
  children: any
}

export default function (props: ListProps<Record<string, any>>) {
  const { children, items, setItems, header, fields, icons } = props;
  const [selectedItems, setSelectedItems] = useState([] as any[]);
  return children({
    ListComponent: <List className="List">
      <ListHeader className="List-header">
        <Checkbox key={"checkbox"} onClick={(e) => {
          if ((e.target as any).checked) setSelectedItems(items.map(item => item._id));
          else setSelectedItems([])
        }} checked={items.length !== 0 && selectedItems.length === items.length} />
        {selectedItems.length}/{items.length}
        <ListHeaderTitle>{header}</ListHeaderTitle>
        <ListHeaderIcons>
          <CancelIconW key={"deleteicon"} onClick={() => {
            const remaining_items = items.filter(item => !selectedItems.includes(item._id))
            setItems(remaining_items);
            setSelectedItems([])
          }} />
        </ListHeaderIcons>
      </ListHeader>
      <ListContent className="List-content">
        {items.length > 0 ? items.map((item, index) => {
          const { _id } = item;
          return <ListContentItem key={_id}>
            {icons?.map(icon => icon(index, _id))}
            <Checkbox key={_id + "checkbox" + index} onClick={(e) => {
              if ((e.target as any).checked) setSelectedItems([...selectedItems, _id])
              else setSelectedItems(selectedItems.filter(item => item !== _id))
            }} checked={selectedItems.includes(_id)} value={_id} />
            <CancelIconW key={_id + "icon" + index} onClick={() => {
              setSelectedItems(selectedItems.filter(item => item !== _id))
              setItems(items.filter(item => item._id !== _id));
            }} />
            {fields.map((field, index) => <ListContentItemField key={_id + field + index}>{typeof field === "string" ? item[field] : field(item)}</ListContentItemField>)}
          </ListContentItem>
        }) : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%" }}>No quizzes uploaded</div>}
      </ListContent>
    </List>,
    list_state: {
      selectedItems
    },
    list_manips: {
      setSelectedItems
    }
  })
}
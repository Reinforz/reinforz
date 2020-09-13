import React, { useState } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { useTheme } from '@material-ui/core/styles';

import Icon from "../Basic/Icon"

import { ExtendedTheme, ListProps } from "../../types";

import "./List.scss";

export default function (props: ListProps<Record<string, any>>) {
  const { children, items, setItems, header, fields, icons } = props;
  const [selectedItems, setSelectedItems] = useState([] as any[]);
  const theme = useTheme() as ExtendedTheme;

  return children({
    ListComponent: <div className="List" style={{ backgroundColor: theme.color.base }}>
      <div className="List-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
        <Checkbox key={"checkbox"} onClick={(e) => {
          if ((e.target as any).checked) setSelectedItems(items.map(item => item._id));
          else setSelectedItems([])
        }} checked={items.length !== 0 && selectedItems.length === items.length} />
        {selectedItems.length}/{items.length}
        <div className="List-header-title">{header}</div>
        <div className="List-header-icons">
          <Icon icon={CancelIcon} popoverText={`Remove ${selectedItems.length} selected items`} className={"List-header-icons--cancel"} key={"deleteicon"} onClick={() => {
            const remaining_items = items.filter(item => !selectedItems.includes(item._id))
            setItems(remaining_items);
            setSelectedItems([])
          }} />
        </div>
      </div>
      <div className="List-content" style={{ color: theme.palette.text.primary }}>
        {items.length > 0 ? items.map((item, index) => {
          const { _id } = item;
          return <div className="List-content-item" key={_id}>
            {icons?.map(icon => icon(index, _id))}
            <div className="List-content-item-icons">
              <Checkbox className="List-content-item-icons--checkbox" key={_id + "checkbox" + index} onClick={(e) => {
                if ((e.target as any).checked) setSelectedItems([...selectedItems, _id])
                else setSelectedItems(selectedItems.filter(item => item !== _id))
              }} checked={selectedItems.includes(_id)} value={_id} />
              <Icon icon={CancelIcon} className="List-content-item-icons--cancel" key={_id + "icon" + index} onClick={() => {
                setSelectedItems(selectedItems.filter(item => item !== _id))
                setItems(items.filter(item => item._id !== _id));
              }} popoverText="Delete this item" />
            </div>
            {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? item[field] : field(item)}</div>)}
          </div>
        }) : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No items uploaded</div>}
      </div>
    </div>,
    ListState: {
      selectedItems
    },
    ListUtils: {
      setSelectedItems
    }
  })
}
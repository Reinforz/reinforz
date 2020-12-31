import React from 'react'
import { Checkbox } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

import { Icon } from '../..';
import { ListItemProps } from "./types"
import { useThemeSettings, useListItems } from '../../../../hooks';

export default function ListItem<T extends { _id: string }>(props: ListItemProps<T>) {
  const { items, item, fields, index, setSelectedItems, setItems, selectedItems } = props;
  const { _id } = item;
  const { theme, settings, sounds } = useThemeSettings();
  const { pop_on, pop_off, remove } = sounds;
  const { selectEndFromClickWithCurrent, selectUptoClickedWithCurrent, selectEndFromClick, selectOnlyClicked, selectUptoClicked, addSelectedItems, removeSelectedItem, removeAndDeleteSelectedItem } = useListItems(items, selectedItems, setItems, setSelectedItems);

  return (
    <div className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light }}>
      <div className="List-content-item-icons">
        <Checkbox color="primary" className="List-content-item-icons--checkbox" key={_id + "checkbox" + index} onClick={(e) => {
          if (e.ctrlKey) {
            if (e.altKey && e.shiftKey)
              selectEndFromClickWithCurrent(index)
            else if (!e.altKey && e.shiftKey)
              selectUptoClickedWithCurrent(index)
          } else {
            if (e.altKey && e.shiftKey)
              selectEndFromClick(index)
            else if (e.altKey && !e.shiftKey)
              selectOnlyClicked(_id)
            else if (!e.altKey && e.shiftKey)
              selectUptoClicked(index)
            else {
              if ((e.target as any).checked) {
                if (settings.sound) pop_on.play();
                addSelectedItems(_id)
              }
              else {
                if (settings.sound) pop_off.play();
                removeSelectedItem(_id)
              }
            }
          }
        }} checked={selectedItems.includes(_id)} value={_id} />
        <Icon key={_id + "icon" + index} popoverText="Delete this item">
          <CancelIcon className="List-content-item-icons--cancel" onClick={() => {
            if (settings.sound) remove.play();
            props.onDelete && props.onDelete([item])
            removeAndDeleteSelectedItem(_id)
          }} style={{ fill: theme.palette.error.dark }} />
        </Icon>
      </div>
      {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? (item as any)[field] : field(item)}</div>)}
    </div>
  )
}

export * from "./types"

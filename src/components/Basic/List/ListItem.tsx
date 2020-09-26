import React from 'react'
import { Checkbox } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

import Icon from '../Icon';

import useThemeSettings from '../../../hooks/useThemeSettings';
import useListItems from '../../../hooks/useListItems';

import { ListItemProps } from '../../../types';

const playOn = new Audio(process.env.PUBLIC_URL + "/sounds/pop-on.mp3");
const playOff = new Audio(process.env.PUBLIC_URL + "/sounds/pop-off.mp3");
const deleteItem = new Audio(process.env.PUBLIC_URL + "/sounds/delete.mp3");

playOn.volume = 0.5;
playOff.volume = 0.5;
deleteItem.volume = 0.5;

export default function ListItem(props: ListItemProps<Record<string, any>>) {
  const { items, item, fields, index, setSelectedItems, setItems, selectedItems } = props;
  const { _id } = item;
  const { theme, settings } = useThemeSettings();
  const { selectEndFromClickWithCurrent, selectUptoClickedWithCurrent, selectEndFromClick, selectOnlyClicked, selectUptoClicked, addSelectedItems, removeSelectedItem, removeAndDeleteSelectedItem } = useListItems(items, selectedItems, setItems, setSelectedItems)
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
                if (settings.sound) playOn.play();
                addSelectedItems(_id)
              }
              else {
                if (settings.sound) playOff.play();
                removeSelectedItem(_id)
              }
            }
          }
        }} checked={selectedItems.includes(_id)} value={_id} />
        <Icon icon={CancelIcon} className="List-content-item-icons--cancel" key={_id + "icon" + index} onClick={() => {
          if (settings.sound) deleteItem.play();
          props.onDelete && props.onDelete([item])
          removeAndDeleteSelectedItem(_id)
        }} popoverText="Delete this item" />
      </div>
      {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? item[field] : field(item)}</div>)}
    </div>
  )
}

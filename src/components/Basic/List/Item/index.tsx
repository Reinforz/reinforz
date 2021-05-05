import React from 'react'
import { Checkbox } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

import { Icon } from '../..';
import { ListItemProps } from "./types"
import { useThemeSettings } from '../../../../hooks';

export default function ListItem<T extends { _id: string }>(props: ListItemProps<T>) {
  const { items, item, item: { _id }, fields, index, toggleItem, setItems, selected_items } = props;
  const { theme, settings, sounds } = useThemeSettings();
  const { pop_on, pop_off, remove } = sounds;
  return (
    <div className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light }}>
      <div className="List-content-item-icons">
        <Checkbox color="primary" className="List-content-item-icons--checkbox" key={_id + "checkbox" + index} onClick={(e) => {
          if (settings.sound) (e.target as any).checked ? pop_on.play() : pop_off.play()
          toggleItem(_id)
        }} checked={selected_items.includes(_id)} value={_id} />
        <Icon key={_id + "icon" + index} popoverText="Delete this item">
          <CancelIcon className="List-content-item-icons--cancel" onClick={() => {
            if (settings.sound) remove.play();
            setItems(items.filter(item => item._id !== _id) as T[])
          }} style={{ fill: theme.palette.error.dark }} />
        </Icon>
      </div>
      {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? (item as any)[field] : field(item)}</div>)}
    </div>
  )
}

export * from "./types"

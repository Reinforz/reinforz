import React, { useRef } from 'react'
import { Checkbox } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'

import { Icon } from '../';

import { useThemeSettings, useListItems } from '../../../hooks';

import { ListItemProps, DragItem } from '../../../types';

export default function ListItem(props: ListItemProps<Record<string, any>>) {
  const { items, item, fields, index, setSelectedItems, setItems, selectedItems } = props;
  const { _id } = item;
  const { theme, settings, sounds } = useThemeSettings();
  const { pop_on, pop_off, remove } = sounds;
  const { selectEndFromClickWithCurrent, selectUptoClickedWithCurrent, selectEndFromClick, selectOnlyClicked, selectUptoClicked, addSelectedItems, removeSelectedItem, removeAndDeleteSelectedItem } = useListItems(items, selectedItems, setItems, setSelectedItems);
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "List",
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      props.onDrag(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'List', _id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div ref={ref} className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light, opacity }}>
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
      {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? item[field] : field(item)}</div>)}
    </div>
  )
}

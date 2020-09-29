import React, { useRef } from 'react'
import { Checkbox } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'

import Icon from '../Icon';

import useThemeSettings from '../../../hooks/useThemeSettings';
import useListItems from '../../../hooks/useListItems';

import { ListItemProps, DragItem } from '../../../types';

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
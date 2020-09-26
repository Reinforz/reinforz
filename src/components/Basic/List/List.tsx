import React, { useCallback } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import update from 'immutability-helper'

import Icon from "../../Basic/Icon"
import ListItem from "./ListItem";

import useList from "../../../hooks/useList";
import useThemeSettings from "../../../hooks/useThemeSettings";

import { ListProps } from "../../../types";

import "./List.scss";

const playOn = new Audio(process.env.PUBLIC_URL + "/sounds/pop-on.mp3");
const playOff = new Audio(process.env.PUBLIC_URL + "/sounds/pop-off.mp3");
const deleteItem = new Audio(process.env.PUBLIC_URL + "/sounds/delete.mp3");

playOn.volume = 0.5;
playOff.volume = 0.5;
deleteItem.volume = 0.5;

export default React.memo((props: ListProps<Record<string, any>>) => {
  const { children, items, setItems, header, fields } = props;
  const { theme, settings } = useThemeSettings();

  const { selectedItems, setSelectedItems, resetSelectedItems, setAllSelected, total_selected, deleteSelectedItems } = useList(items, setItems)

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const item = items[dragIndex];
      setItems(
        update(items, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, item],
          ],
        }),
      )
    },
    // eslint-disable-next-line
    [items],
  )

  return children({
    ListComponent: <div className="List" style={{ backgroundColor: theme.color.base }}>
      <div className="List-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
        <Checkbox color="primary" key={"checkbox"} onClick={(e) => {
          if ((e.target as any).checked) {
            if (settings.sound) playOn.play();
            setAllSelected()
          }
          else {
            if (settings.sound) playOff.play();
            resetSelectedItems()
          }
        }} checked={items.length !== 0 && total_selected === items.length} />
        {total_selected}/{items.length}
        <div className="List-header-title">{header}</div>
        <div className="List-header-icons">
          <Icon icon={CancelIcon} popoverText={`Remove ${total_selected} selected items`} className={"List-header-icons--cancel"} key={"deleteicon"} onClick={() => {
            if (settings.sound) deleteItem.play();
            const new_items = deleteSelectedItems()
            props.onDelete && props.onDelete(new_items)
          }} />
        </div>
      </div>
      <div className="List-content" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
        {items.length > 0 ? <TransitionGroup component={null}>
          {items.map((item, index) =>
            <CSSTransition
              appear
              timeout={{
                enter: (index + 1) * 250,
                exit: 250
              }}
              key={item._id}
              classNames={settings.animation ? "fade" : undefined}
            >
              <ListItem onDrag={moveItem} key={item._id} items={items} selectedItems={selectedItems} setSelectedItems={setSelectedItems} setItems={setItems} item={item} fields={fields} index={index} /></CSSTransition>)}
        </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No items uploaded</div>}
      </div>
    </div>,
    ListState: {
      selectedItems
    },
    ListUtils: {
      setSelectedItems
    }
  })
})
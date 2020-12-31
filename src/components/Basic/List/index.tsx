import React from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import clsx from "clsx";

import { Icon } from ".."
import ListItem from "./Item";

import { useList, useThemeSettings } from "../../../hooks";

import "./style.scss";
import { ListProps, ListState } from "./types";

function List<T extends { _id: string }>(props: ListProps<T>) {
  const { children, items, header, fields, className } = props;
  const { theme, settings, sounds: { pop_on, pop_off, remove } } = useThemeSettings();

  const { selected_items, selectItems, deselectAllItems, deleteItem, selectAllItems, toggleItem, total_selected, deleteSelectedItems } = useList(items)

  return <>
    <div className={clsx("List", className)} style={{ backgroundColor: theme.color.base }}>
      <div className="List-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
        <Checkbox color="primary" key={"checkbox"} onClick={(e) => {
          if ((e.target as any).checked) {
            if (settings.sound) pop_on.play();
            selectAllItems()
          }
          else {
            if (settings.sound) pop_off.play();
            deselectAllItems()
          }
        }} checked={items.length !== 0 && total_selected === items.length} />
        {total_selected}/{items.length}
        <div className="List-header-title">{header}</div>
        <div className="List-header-icons">
          <Icon popoverText={`Remove ${total_selected} selected items`} key={"deleteicon"} >
            <CancelIcon className={"List-header-icons--cancel"} onClick={() => {
              if (settings.sound) remove.play();
              deleteSelectedItems()
            }} />
          </Icon>
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
              <ListItem key={item._id} item={item} selected_items={selected_items} toggleItem={toggleItem} deleteItem={deleteItem} fields={fields as any} index={index} /></CSSTransition>)}
        </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No items uploaded</div>}
      </div>
    </div>
    {children({
      selected_items,
      selectItems
    } as ListState)}
  </>
}

export default List;

export * from "./types"
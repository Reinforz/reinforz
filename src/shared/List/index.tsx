import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import update from 'immutability-helper';
import React, { useCallback } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useList from "../../../hooks/useList";
import useThemeSettings from "../../../hooks/useThemeSettings";
import { ListProps } from "../../../types";
import Icon from "../../Basic/Icon";
import ListItem from "./ListItem";
import "./style.scss";

export default React.memo((props: ListProps<Record<string, any>>) => {
  const { children, items, setItems, header, fields } = props;
  const { theme, settings, sounds } = useThemeSettings();
  const { pop_on, pop_off, remove } = sounds;

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
            if (settings.sound) pop_on.play();
            setAllSelected()
          }
          else {
            if (settings.sound) pop_off.play();
            resetSelectedItems()
          }
        }} checked={items.length !== 0 && total_selected === items.length} />
        {total_selected}/{items.length}
        <div className="List-header-title">{header}</div>
        <div className="List-header-icons">
          <Icon popoverText={`Remove ${total_selected} selected items`} key={"deleteicon"} >
            <CancelIcon className={"List-header-icons--cancel"} onClick={() => {
              if (settings.sound) remove.play();
              const new_items = deleteSelectedItems()
              props.onDelete && props.onDelete(new_items)
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
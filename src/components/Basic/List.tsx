import React, { useContext } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { useTheme } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Icon from "../Basic/Icon"

import { ExtendedTheme, ListProps, ISettings } from "../../types";

import useList from "../../hooks/useList";

import SettingsContext from "../../context/SettingsContext";

import "./List.scss";

const playOn = new Audio(process.env.PUBLIC_URL + "/sounds/pop-on.mp3");
const playOff = new Audio(process.env.PUBLIC_URL + "/sounds/pop-off.mp3");
const deleteItem = new Audio(process.env.PUBLIC_URL + "/sounds/delete.mp3");

playOn.volume = 0.5;
playOff.volume = 0.5;
deleteItem.volume = 0.5;

export default React.memo((props: ListProps<Record<string, any>>) => {
  const { children, items, setItems, header, fields, icons } = props;
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;

  const { selectedItems, selectEndFromClickWithCurrent,
    selectUptoClickedWithCurrent, selectEndFromClick, selectUptoClicked, setSelectedItems, resetSelectedItems, setAllSelected, addSelectedItems, removeSelectedItem, removeAndDeleteSelectedItem, total_selected, deleteSelectedItems, selectOnlyClicked } = useList(items, setItems)

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
          {items.map((item, index) => {
            const { _id } = item;
            return <CSSTransition
              key={_id}
              appear
              timeout={{
                enter: /* !new_items.includes(_id) ?  */(index + 1) * 250 /* : (index + 1 - new_items.length) * 250 */,
                exit: (index + 1) * 250
              }}
              classNames={settings.animation ? "fade" : undefined}
            >
              <div className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light }}>
                {icons?.map(icon => icon(index, _id))}
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
            </CSSTransition>
          })}
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
import React, { useContext, useState } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { useTheme } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useSound from 'use-sound';

import Icon from "../Basic/Icon"

import { ExtendedTheme, ListProps, ISettings } from "../../types";

import SettingsContext from "../../context/SettingsContext";

import "./List.scss";

export default function (props: ListProps<Record<string, any>>) {
  const { children, items, setItems, header, fields, icons } = props;
  const [selectedItems, setSelectedItems] = useState([] as any[]);
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;
  const [playOn] = useSound(process.env.PUBLIC_URL + "/sounds/pop-on.mp3", { volume: 0.25 });
  const [playOff] = useSound(process.env.PUBLIC_URL + "/sounds/pop-off.mp3", { volume: 0.25 });
  const [deleteItem] = useSound(process.env.PUBLIC_URL + "/sounds/delete.mp3", { volume: 0.25 });

  return children({
    ListComponent: <div className="List" style={{ backgroundColor: theme.color.base }}>
      <div className="List-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
        <Checkbox color="primary" key={"checkbox"} onClick={(e) => {
          if ((e.target as any).checked) {
            if (settings.sound) playOn();
            setSelectedItems(items.map(item => item._id));
          }
          else {
            if (settings.sound) playOff();
            setSelectedItems([])
          }
        }} checked={items.length !== 0 && selectedItems.length === items.length} />
        {selectedItems.length}/{items.length}
        <div className="List-header-title">{header}</div>
        <div className="List-header-icons">
          <Icon icon={CancelIcon} popoverText={`Remove ${selectedItems.length} selected items`} className={"List-header-icons--cancel"} key={"deleteicon"} onClick={() => {
            if (settings.sound) deleteItem();
            setItems(items.filter(item => !selectedItems.includes(item._id)));
            setSelectedItems([])
          }} />
        </div>
      </div>
      <div className="List-content" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
        {items.length > 0 ? <TransitionGroup component={null}>
          {items.map((item, index) => {
            const { _id } = item;
            return <CSSTransition
              key={_id + index}
              timeout={{
                enter: (index + 1) * 250,
                exit: (index + 1) * 250
              }}
              classNames={settings.animation ? "fade" : undefined}
              appear
            >
              <div className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light }}>
                {icons?.map(icon => icon(index, _id))}
                <div className="List-content-item-icons">
                  <Checkbox color="primary" className="List-content-item-icons--checkbox" key={_id + "checkbox" + index} onClick={(e) => {
                    if ((e.target as any).checked) {
                      if (settings.sound) playOn();
                      setSelectedItems([...selectedItems, _id])
                    }
                    else {
                      if (settings.sound) playOff();
                      setSelectedItems(selectedItems.filter(item => item !== _id))
                    }
                  }} checked={selectedItems.includes(_id)} value={_id} />
                  <Icon icon={CancelIcon} className="List-content-item-icons--cancel" key={_id + "icon" + index} onClick={() => {
                    if (settings.sound) deleteItem();
                    setSelectedItems(selectedItems.filter(item => item !== _id))
                    setItems(items.filter(item => item._id !== _id));
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
}
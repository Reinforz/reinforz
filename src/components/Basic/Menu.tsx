import { useTheme } from "@material-ui/styles";
import React, { useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa"
import { RiArrowLeftRightLine } from "react-icons/ri";

import { ExtendedTheme, MenuProps } from "../../types";

import Icon from "./Icon";

import "./Menu.scss";

export default function (props: MenuProps) {
  const { width = 300, initial_position, lskey, content_id, initial_open, children } = props;
  let menu_ls_state = null;
  if (lskey) {
    const ls_value = localStorage.getItem(lskey);
    if (ls_value)
      menu_ls_state = JSON.parse(ls_value)
  } else {
    menu_ls_state = {
      initial_position: initial_position || "left",
      initial_open: initial_open || false
    };
  }
  const [is_open, setIsOpen] = useState(menu_ls_state.is_open);
  const [position, setPosition] = useState(menu_ls_state.position);
  const theme = useTheme() as ExtendedTheme;

  const content_elem = document.getElementById(content_id);

  if (content_elem)
    content_elem.style.position = `absolute`;

  let left = null, icons_style = {
    backgroundColor: theme.color.dark
  } as any, icon_style = {} as any;

  if (position === "right") {
    if (is_open) {
      left = `calc(100% - ${width}px)`;
      icon_style.transform = "rotate(0deg)";
      icons_style.left = "-40px"
      if (content_elem) {
        content_elem.style.width = `calc(100% - ${width}px)`;
        content_elem.style.left = `0px`;
      }
    }
    else {
      left = "100%"
      icon_style.transform = "rotate(-180deg)";
      icons_style.left = "-40px"
      if (content_elem) {
        content_elem.style.width = `100%`;
        content_elem.style.left = `0px`;
      }
    }
  } else {
    if (is_open) {
      left = "0px"
      icon_style.transform = "rotate(-180deg)";;
      icons_style.left = "100%"
      if (content_elem) {
        content_elem.style.width = `calc(100% - ${width}px)`;
        content_elem.style.left = `${width}px`;
      }
    }
    else {
      left = `-${width}px`
      icon_style.transform = "rotate(0deg)"
      icons_style.left = "100%"
      if (content_elem) {
        content_elem.style.width = `100%`;
        content_elem.style.left = `0px`;
      }
    }
  }

  return <div className="Menu" style={{ left }}>
    <div className="Menu-icons" style={icons_style}>
      <Icon popoverText={`${is_open ? "Close" : "Open"} Menu`} icon={FaArrowAltCircleRight} className="Menu-icons-icon Menu-icons-icon--toggle" onClick={() => {
        const new_value = !is_open
        setIsOpen(new_value)
        lskey && localStorage.setItem(lskey, JSON.stringify({
          is_open: new_value,
          position
        }))
      }} style={{ fill: theme.color.opposite_dark, ...icon_style }} />
      <Icon popoverText={`Switch to ${position === "left" ? "right" : "left"}`} icon={RiArrowLeftRightLine} className="Menu-icons-icon Menu-icons-icon--position" onClick={() => {
        const new_value = position === "left" ? "right" : "left"
        setPosition(new_value)
        lskey && localStorage.setItem(lskey, JSON.stringify({
          is_open,
          position: new_value
        }))
      }} style={{ fill: theme.color.opposite_dark }} />
    </div>
    {children}
  </div>
}
import React from 'react';
import { BiGridHorizontal, BiGridVertical } from "react-icons/bi";
import { HiSwitchVertical, HiSwitchHorizontal } from "react-icons/hi";
import * as CSS from 'csstype';

import Icon from './Icon';

import useThemeSettings from '../../hooks/useThemeSettings';
import useToggle from '../../hooks/useToggle';

import "./View.scss";

const switch_off = new Audio(process.env.PUBLIC_URL + "/sounds/switch-off.mp3");
const switch_on = new Audio(process.env.PUBLIC_URL + "/sounds/switch-on.mp3");
switch_off.volume = 0.25;
switch_on.volume = 0.25;

export default function (props: { items: JSX.Element[] }) {
  const { theme } = useThemeSettings();

  const { toggle: toggleOrder, current_toggle: order } = useToggle<number>(0, [0, 1], "order");
  const { toggle: toggleLayout, current_toggle: layout } = useToggle<CSS.FlexDirectionProperty>("row", ["row", "column"], "layout");

  return <div className="View" style={{ flexDirection: layout }}>
    <div className="View-icons">
      <div className="View-icons-layout" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
        <Icon popoverText="Click to switch to column layout">
          <BiGridHorizontal style={{ display: layout === "row" ? "initial" : "none" }} onClick={() => {
            toggleLayout();
          }} />
        </Icon>
        <Icon popoverText="Click to switch to row layout">
          <BiGridVertical onClick={() => {
            toggleLayout();
          }} style={{ display: layout === "column" ? "initial" : "none" }} />
        </Icon>
      </div>
      <div className="View-icons-order" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
        <Icon popoverText="Click to switch to alternate order" >
          <HiSwitchVertical onClick={() => {
            toggleOrder();
          }} style={{ display: layout === "column" ? "initial" : "none" }} />
        </Icon>
        <Icon popoverText="Click to switch to alternate order" >
          <HiSwitchHorizontal onClick={() => {
            toggleOrder();
          }} style={{ display: layout === "row" ? "initial" : "none" }} />
        </Icon>
      </div>
    </div>
    {props.items.map((item, index) => <div style={{ order: index === 0 ? order : "initial", height: layout === "column" ? "50%" : "100%" }} key={index}>{item}</div>)}
  </div>
}
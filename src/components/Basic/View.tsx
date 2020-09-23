import React, { useState, Fragment } from 'react';
import { BiGridHorizontal, BiGridVertical } from "react-icons/bi";
import { HiSwitchVertical, HiSwitchHorizontal } from "react-icons/hi";

import Icon from './Icon';

import useThemeSettings from '../../hooks/useThemeSettings';

import "./View.scss";

const switch_off = new Audio(process.env.PUBLIC_URL + "/sounds/switch-off.mp3");
const switch_on = new Audio(process.env.PUBLIC_URL + "/sounds/switch-on.mp3");
switch_off.volume = 0.25;
switch_on.volume = 0.25;

export default function (props: { items: JSX.Element[] }) {
  const [layout, setLayout] = useState(localStorage.getItem("layout") || "row" as ("row" | "column"));
  const [order, setOrder] = useState(localStorage.getItem("order") || "0");
  const { theme, settings } = useThemeSettings();

  return <div className="View" style={{ gridTemplateColumns: layout === "column" ? "1fr 1fr" : "1fr", gridTemplateRows: layout === "row" ? "1fr 1fr" : "1fr" }}>
    <div className="View-icons">
      <div className="View-icons-layout" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
        <Icon onClick={() => {
          if (settings.sound) switch_off.play();
          localStorage.setItem("layout", "column");
          setLayout("column")
        }} icon={BiGridHorizontal} style={{ display: layout === "row" ? "initial" : "none" }} popoverText="Click to switch to column layout" />
        <Icon onClick={() => {
          if (settings.sound) switch_on.play();
          localStorage.setItem("layout", "row");
          setLayout("row")
        }} icon={BiGridVertical} style={{ display: layout === "column" ? "initial" : "none" }} popoverText="Click to switch to row layout" />
      </div>
      <div className="View-icons-order" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
        <Icon onClick={() => {
          if (settings.sound) switch_off.play();
          localStorage.setItem("order", order === "0" ? "1" : "0");
          setOrder(order === "0" ? "1" : "0")
        }} icon={HiSwitchVertical} style={{ display: layout === "row" ? "initial" : "none" }} popoverText="Click to switch to alternate order" />
        <Icon onClick={() => {
          if (settings.sound) switch_on.play();
          localStorage.setItem("order", order === "0" ? "1" : "0");
          setOrder(order === "1" ? "0" : "1")
        }} icon={HiSwitchHorizontal} style={{ display: layout === "column" ? "initial" : "none" }} popoverText="Click to switch to alternate order" />
      </div>

    </div>
    {(order === "0" && <Fragment>{props.items[0]}{props.items[1]}</Fragment>)}
    {(order === "1" && <Fragment>{props.items[1]}{props.items[0]}</Fragment>)}
  </div>
}
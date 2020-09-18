import { useTheme } from '@material-ui/styles';
import React, { useState, Fragment } from 'react';
import { BiGridHorizontal, BiGridVertical } from "react-icons/bi";
import { HiSwitchVertical, HiSwitchHorizontal } from "react-icons/hi";

import Icon from './Icon';

import { ExtendedTheme } from '../../types';

import "./View.scss";

export default function (props: { items: JSX.Element[] }) {
  const [layout, setLayout] = useState(localStorage.getItem("layout") || "row" as ("row" | "column"));
  const [order, setOrder] = useState(localStorage.getItem("order") || "0");
  const theme = useTheme() as ExtendedTheme;

  return <div className="View" style={{ gridTemplateColumns: layout === "column" ? "1fr 1fr" : "1fr", gridTemplateRows: layout === "row" ? "1fr 1fr" : "1fr" }}>
    <div className="View-icons">
      <div className="View-icons-layout" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
        <Icon onClick={() => {
          localStorage.setItem("layout", "column");
          setLayout("column")
        }} icon={BiGridHorizontal} style={{ display: layout === "row" ? "initial" : "none" }} popoverText="Click to switch to column layout" />
        <Icon onClick={() => {
          localStorage.setItem("layout", "row");
          setLayout("row")
        }} icon={BiGridVertical} style={{ display: layout === "column" ? "initial" : "none" }} popoverText="Click to switch to row layout" />
      </div>
      <div className="View-icons-order" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
        <Icon onClick={() => {
          localStorage.setItem("order", order === "0" ? "1" : "0");
          setOrder(order === "0" ? "1" : "0")
        }} icon={HiSwitchVertical} style={{ display: layout === "row" ? "initial" : "none" }} popoverText="Click to switch to alternate order" />
        <Icon onClick={() => {
          localStorage.setItem("order", order === "0" ? "1" : "0");
          setOrder(order === "0" ? "1" : "0")
        }} icon={HiSwitchHorizontal} style={{ display: layout === "column" ? "initial" : "none" }} popoverText="Click to switch to alternate order" />
      </div>

    </div>
    {(order === "0" ? props.items.reverse() : props.items).map((item, index) => <Fragment key={index}>{item}</Fragment>)}
  </div>
}
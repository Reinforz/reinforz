import { useTheme } from '@material-ui/styles';
import React, { useState } from 'react';
import { BiGridHorizontal, BiGridVertical } from "react-icons/bi";

import Icon from './Icon';

import { ViewProps, ExtendedTheme } from '../../types';

import "./View.scss";

export default function (props: ViewProps) {
  const [view, setView] = useState(localStorage.getItem("view") || "row" as ("row" | "column"));
  const theme = useTheme() as ExtendedTheme;

  return <div className="View" style={{ gridTemplateColumns: view === "column" ? "1fr 1fr" : "1fr", gridTemplateRows: view === "row" ? "1fr 1fr" : "1fr" }}>
    <div className="View-selector" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.light }}>
      <Icon onClick={() => {
        localStorage.setItem("view", "column");
        setView("column")
      }} icon={BiGridHorizontal} style={{ display: view === "row" ? "initial" : "none" }} popoverText="Click to switch to column view" />
      <Icon onClick={() => {
        localStorage.setItem("view", "row");
        setView("row")
      }} icon={BiGridVertical} style={{ display: view === "column" ? "initial" : "none" }} popoverText="Click to switch to row view" />
    </div>
    {props.children}
  </div>
}
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import React from "react";

import useThemeSettings from "../../../../hooks/useThemeSettings";

import "./style.scss";

import { CustomSelectProps } from "./types"

const transformLabel = (stat: string) => {
  let label = stat.replace(/(\.|_)/g, " ");
  return label.split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ");
}

export function CustomSelect({ label, value, onChange, items }: CustomSelectProps) {
  const { settings, sounds: { click } } = useThemeSettings();

  return <FormControl >
    <InputLabel >{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => {
        if (settings.sound) click.play();
        onChange(e)
      }}
    >
      {items.map(((type, index) => <MenuItem value={type} key={type + index}>{transformLabel(type)}</MenuItem>))}
    </Select>
  </FormControl>
}

export * from "./types";
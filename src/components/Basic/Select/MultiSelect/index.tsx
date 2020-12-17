import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import React from "react";

import { useThemeSettings } from "../../../../hooks";

import "./style.scss";

import { MultiSelectProps } from "./types"

const transformLabel = (stat: string) => {
  let label = stat.replace(/(\.|_)/g, " ");
  return label.split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ");
}

export function MultiSelect({ label, value, onChange, items }: MultiSelectProps) {
  const { settings, sounds: { click } } = useThemeSettings();

  return <FormControl >
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      renderValue={(items) => (items as string[]).map((item) => <div key={item + label}>{transformLabel(item)}</div>)}
      value={value}
      onChange={(e) => {
        if (settings.sound) click.play();
        onChange(e as any)
      }}
    >
      {items.map(((type, index) => <MenuItem value={type} key={type + index}>{transformLabel(type)}</MenuItem>))}
    </Select>
  </FormControl>
}

export * from "./types";
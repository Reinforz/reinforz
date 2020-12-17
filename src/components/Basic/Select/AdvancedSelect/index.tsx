import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import React from "react";

import useThemeSettings from "../../../../hooks/useThemeSettings";

import "./style.scss";

import { AdvancedSelectProps } from "./types"

export function AdvancedSelect<T extends { _id: string }>({ transformDisplay, label, value, onChange, items }: AdvancedSelectProps<T>) {
  const { settings, sounds: { click } } = useThemeSettings();

  return <FormControl >
    <InputLabel>{label}</InputLabel>
    <Select
      multiple
      renderValue={(items) => (items as T[]).map((item) => <div key={item + label}>{transformDisplay(item)}</div>)}
      value={value}
      onChange={(e) => {
        if (settings.sound) click.play();
        onChange(e as any)
      }}
    >
      {items.map(((item) => <MenuItem value={item._id} key={item._id}>{transformDisplay(item)}</MenuItem>))}
    </Select>
  </FormControl>
}

export * from "./types";
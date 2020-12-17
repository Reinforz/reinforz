import { FormControlLabel, Checkbox } from "@material-ui/core";
import React from "react";

import { useThemeSettings } from "../../../../hooks";

import { BasicCheckboxProps } from "./types";

import "./style.scss";

export function BasicCheckbox({ onChange, name, checked, disabled = false }: BasicCheckboxProps) {
  const { settings, sounds: { pop_off, pop_on } } = useThemeSettings();

  const label = name.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ");

  return <FormControlLabel control={
    <Checkbox disabled={disabled} color={"primary"} name={name} checked={checked} onClick={(e) => {
      if ((e.target as any).checked && settings.sound)
        pop_on.play();
      else if (settings.sound) pop_off.play()
    }} onChange={onChange} />
  } label={label} />
}

export * from "./types"
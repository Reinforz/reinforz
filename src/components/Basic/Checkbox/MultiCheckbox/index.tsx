import React from "react";
import { FormGroup, InputLabel, FormControlLabel, Checkbox } from "@material-ui/core";

import { capitalize } from "../../../../utils";

import "./style.scss";
import { MultiCheckboxProps } from "./types";
import useThemeSettings from "../../../../hooks/useThemeSettings";

export function MultiCheckbox<S>({ name, state, setState, items }: MultiCheckboxProps<S>) {
  const { settings, sounds: { pop_off, pop_on } } = useThemeSettings();

  return <FormGroup>
    <InputLabel>{capitalize(name as string)}</InputLabel>
    {items.map((item) => <FormControlLabel key={item} label={item} control={<Checkbox checked={(state[name] as any).includes(item)} name={item} onChange={(e) => {
      if ((e.target as any).checked) {
        if (settings.sound) pop_on.play()
        setState({ ...state, [name]: (state[name] as any).concat(item) });
      }
      else {
        if (settings.sound) pop_off.play()
        setState({ ...state, [name]: (state[name] as any).filter((excluded_item: string) => excluded_item !== item) })
      }
    }}
      color="primary" />} />)}
  </FormGroup>
}

export * from "./types"
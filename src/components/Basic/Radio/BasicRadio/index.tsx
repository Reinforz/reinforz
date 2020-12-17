import React from "react";
import { RadioGroup, InputLabel, FormControlLabel, Radio, capitalize } from "@material-ui/core";

import { BasicRadioProps } from "./types";

import "./style.scss";

import useThemeSettings from "../../../../hooks/useThemeSettings";

export function BasicRadio<T>({ name, state, setState, items }: BasicRadioProps<T>) {
  const { settings, sounds: { switch_on } } = useThemeSettings();

  return <RadioGroup name={name as string} value={state[name]}>
    <InputLabel>{capitalize(name.toString())}</InputLabel>
    {items.map((item) => <FormControlLabel onClick={(e: any) => {
      if (settings.sound) switch_on.play();
      setState({ ...state, [name]: e.target.value })
    }} key={item.toString()} value={item.toString()} control={<Radio color="primary" />} label={capitalize(item.toString())} />)}
  </RadioGroup>
}

export * from "./types"
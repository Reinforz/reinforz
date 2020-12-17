import React from "react";

import { BasicRadio } from "../";

import { BasicRadioGroupProps } from "./types"

import "./style.scss";

export function BasicRadioGroup<T>(props: BasicRadioGroupProps<T>) {
  return <>{props.items.map(([name, items]) => <BasicRadio items={items} name={name} setState={props.setState} state={props.state} />)}</>
}

export * from "./types"
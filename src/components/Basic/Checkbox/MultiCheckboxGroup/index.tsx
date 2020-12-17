import React from "react";

import { MultiCheckbox } from "../";

import { MultiCheckboxGroupProps } from "./types"

import "./style.scss";

export function MultiCheckboxGroup<T>(props: MultiCheckboxGroupProps<T>) {
  return <>{props.items.map(([name, items]) => <MultiCheckbox items={items} name={name} setState={props.setState} state={props.state} />)}</>
}

export * from "./types"
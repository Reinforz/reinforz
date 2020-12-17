import React from "react";
import { Button } from "@material-ui/core";

import { ResetButtonProps } from "./types";

import "./style.scss";

import { useThemeSettings } from "../../../../hooks";

export function ResetButton(props: ResetButtonProps) {
  const { settings, sounds: { reset } } = useThemeSettings();

  return <Button variant="contained" color="primary" onClick={(e) => {
    if (settings.sound) reset.play()
    props.onClick(e);
  }
  } style={{ width: "100%" }}>{props.message ?? "Reset"}</Button>
}

export * from "./types"
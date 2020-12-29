import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { useSnackbar } from "notistack";

import { useThemeSettings } from "../../../../hooks";

import { PlaySettingsButtonProps } from "./types";
import { PlayContext } from "../..";

export default function ({ filtered_questions, selected_quizzes_length }: PlaySettingsButtonProps) {
  const { settings, sounds: { swoosh, horn } } = useThemeSettings(), { setPlaying } = useContext(PlayContext);
  const { enqueueSnackbar } = useSnackbar();

  return <Button disabled={(filtered_questions.length === 0 && selected_quizzes_length !== 0) || selected_quizzes_length === 0} className="PlaySettings-button" color="primary" variant="contained" onClick={() => {
    if (selected_quizzes_length > 0 && filtered_questions.length > 0) {
      if (settings.sound) swoosh.play();
      setPlaying(true)
    }
    else if (filtered_questions.length === 0 && selected_quizzes_length !== 0) {
      if (settings.sound) horn.play()
      enqueueSnackbar('You must have atleast one question to play', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      })
    }
    else if (selected_quizzes_length === 0) {
      if (settings.sound) horn.play()
      enqueueSnackbar('You must have atleast one quiz selected', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      })
    }
  }}>Start</Button>
}

export * from "./types"
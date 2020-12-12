import { Button } from "@material-ui/core";
import React from "react";
import { useSnackbar } from "notistack";

import useThemeSettings from "../../../../hooks/useThemeSettings";

import { PlaySettingsButtonProps } from "./types";

export default function ({ filtered_questions, selected_quizzes, setPlaying }: PlaySettingsButtonProps) {
  const { settings, sounds: { swoosh, horn } } = useThemeSettings();
  const { enqueueSnackbar } = useSnackbar();

  return <Button disabled={(filtered_questions.length === 0 && selected_quizzes.length !== 0) || selected_quizzes.length === 0} className="PlaySettings-button" color="primary" variant="contained" onClick={() => {
    if (selected_quizzes.length > 0 && filtered_questions.length > 0) {
      if (settings.sound) swoosh.play();
      setPlaying(true)
    }
    else if (filtered_questions.length === 0 && selected_quizzes.length !== 0) {
      if (settings.sound) horn.play()
      enqueueSnackbar('You must have atleast one question to play', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      })
    }
    else if (selected_quizzes.length === 0) {
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
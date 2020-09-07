import React, { useState } from "react";
import { Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { IPlayOptions } from "../types";
import { useSnackbar } from "notistack";

interface PlayOptionsProps {
  children: any,
  selectedQuizzes: string[],
  setPlaying: (isPlaying: boolean) => any
}

function PlayOptions(props: PlayOptionsProps) {
  const play_options_state = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true, flatten_mix: false };
  type play_options_keys = keyof IPlayOptions;
  const [play_options, setPlayOptions] = useState(play_options_state as IPlayOptions);
  const { enqueueSnackbar } = useSnackbar();

  return (
    props.children({
      play_options,
      PlayOptions: <div className="Play-options">
        <div className="Play-options-header">Options</div>
        <div className="Play-options-content">
          {Object.keys(play_options_state).map((key, index) => {
            return <FormControlLabel key={key + index}
              control={
                <Checkbox
                  disabled={Boolean(key.match(/(shuffle_questions|shuffle_quizzes)/) && play_options.flatten_mix)}
                  checked={play_options[key as play_options_keys]}
                  onChange={(event, checked) => {
                    if (key === "flatten_mix") setPlayOptions({ ...play_options, [event.target.name]: checked, shuffle_questions: checked, shuffle_quizzes: checked })
                    else setPlayOptions({ ...play_options, [event.target.name]: checked })
                  }}
                  name={key}
                  color="primary"
                />
              }
              label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
            />
          })}
        </div>
        <Button color="primary" style={{ margin: "0 auto", fontSize: "1rem" }} variant="contained" onClick={() => {
          if (props.selectedQuizzes.length > 0)
            props.setPlaying(true)
          else enqueueSnackbar('You must have atleast one quiz selected', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          })
        }}>Start</Button>
      </div>
    })

  );
}

export default PlayOptions;
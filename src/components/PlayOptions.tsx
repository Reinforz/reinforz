import React, { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { IPlayOptions } from "../types";

interface PlayOptionsProps {
  children: any
}

function PlayOptions(props: PlayOptionsProps) {
  const play_options_obj = { shuffle_options: true, shuffle_quizzes: false, shuffle_questions: true, instant_feedback: true };
  type play_options_keys = keyof IPlayOptions;
  const [play_options, setPlayOptions] = useState(play_options_obj as IPlayOptions);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setPlayOptions({ ...play_options, [event.target.name]: checked });
  }

  return (
    props.children({
      play_options,
      PlayOptions: <div className="Play-options">
        <div className="Play-options-header">Options</div>
        {Object.keys(play_options_obj).map((key, index) => <FormControlLabel key={key + index}
          control={
            <Checkbox
              checked={play_options[key as play_options_keys]}
              onChange={handleChange}
              name={key}
              color="primary"
            />
          }
          label={key.split("_").map(k => k.charAt(0).toUpperCase() + k.substr(1)).join(" ")}
        />)}
      </div>
    })

  );
}

export default PlayOptions;
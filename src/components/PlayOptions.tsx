import React, { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

interface PlayOptionsProps {
  children: any
}

function PlayOptions(props: PlayOptionsProps) {
  const [play_options, setPlayOptions] = useState({ shuffle_options: false, shuffle_quizzes: false, shuffle_questions: false });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setPlayOptions({ ...play_options, [event.target.name]: checked });
  }

  return (
    props.children({
      play_options,
      PlayOptions: <div className="PlayOptions"><FormControlLabel
        control={
          <Checkbox
            checked={play_options.shuffle_options}
            onChange={handleChange}
            name="shuffle_options"
            color="primary"
          />
        }
        label="Shuffle Options"
      />
        <FormControlLabel
          control={
            <Checkbox
              checked={play_options.shuffle_quizzes}
              onChange={handleChange}
              name="shuffle_quizzes"
              color="primary"
            />
          }
          label="Shuffle Quizzes"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={play_options.shuffle_questions}
              onChange={handleChange}
              name="shuffle_questions"
              color="primary"
            />
          }
          label="Shuffle Questions"
        />
      </div>
    })

  );
}

export default PlayOptions;
import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import { Button, FormControlLabel, FormGroup, InputLabel, Radio, RadioGroup, Switch, useTheme, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { green, red } from '@material-ui/core/colors';

import { ExtendedTheme, SettingsProps } from '../../types';

import "./Settings.scss";

const OnOffSwitch = withStyles({
  switchBase: {
    color: red[500],

    '&$checked': {
      color: green[500],
    },
    '&$checked + $track': {
      backgroundColor: green[500],
    },
  },
  'track': {
    backgroundColor: red[500],
  },
  checked: {},
})(Switch);

function Settings(props: SettingsProps) {
  const { settings, setSettings } = props;
  const { theme, animation, sound } = settings;
  const history = useHistory();
  const THEME = useTheme() as ExtendedTheme;

  return (
    <div className="Settings" style={{ backgroundColor: THEME.color.light }}>
      <div className="Settings-header" style={{ backgroundColor: THEME.color.dark, color: THEME.palette.text.secondary }}>Settings</div>
      <div className="Settings-content">
        <RadioGroup name="theme" value={theme} row className="Settings-content-group" style={{ backgroundColor: THEME.color.base }}>
          <InputLabel className="Settings-content-group-label">Theme</InputLabel>
          {["dark", "light"].map((_theme, index) => <FormControlLabel onClick={(e: any) => {
            setSettings({ ...settings, theme: theme === "dark" ? "light" : "dark" })
          }} key={_theme.toString() + index} value={_theme} control={<Radio color="primary" />} label={_theme === "dark" ? <BsMoon className="Settings-icon Settings-icon--theme" style={{ fill: THEME.color.opposite_dark }} /> : <BsSun className="Settings-icon Settings-icon--theme" style={{ fill: THEME.color.opposite_dark }} />} />)}
        </RadioGroup>
        <FormGroup row className="Settings-content-group" style={{ backgroundColor: THEME.color.base }}>
          <InputLabel className="Settings-content-group-label">Animation</InputLabel>
          <OnOffSwitch
            checked={settings.animation}
            onChange={(e) => {
              setSettings({ ...settings, animation: !animation })
            }}
          />
        </FormGroup>
        <FormGroup row className="Settings-content-group" style={{ backgroundColor: THEME.color.base }}>
          <InputLabel className="Settings-content-group-label">Sound</InputLabel>
          <OnOffSwitch
            checked={settings.sound}
            onChange={(e) => {
              setSettings({ ...settings, sound: !sound })
            }}
          />
        </FormGroup>
        <Button variant="contained" color="primary" className="Settings-content-button" onClick={() => {
          localStorage.setItem("sound", String(sound));
          localStorage.setItem("animation", String(animation));
          localStorage.setItem("THEME", theme);
          history.push("/")
        }}>Back to Home</Button>

      </div>
    </div>
  );
}

export default Settings;
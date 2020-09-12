import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import { FormControlLabel, FormGroup, InputLabel, Radio, RadioGroup, Switch } from '@material-ui/core';

import { SettingsProps } from '../../types';

function Settings(props: SettingsProps) {
  const { settings, setSettings } = props;
  const { theme, animation, sound } = settings;

  return (
    <div className="Settings">
      <RadioGroup name="theme" value={theme} row>
        <InputLabel>Theme</InputLabel>
        {["dark", "light"].map((_theme, index) => <FormControlLabel onClick={(e: any) => {
          const set_theme = theme === "dark" ? "light" : "dark";
          localStorage.setItem("THEME", set_theme);
          setSettings({ ...settings, theme: set_theme })
        }} key={_theme.toString() + index} value={_theme} control={<Radio color="primary" />} label={_theme === "dark" ? <BsMoon className="Settings-icon Settings-icon--theme" /> : <BsSun className="Settings-icon Settings-icon--theme" />} />)}
      </RadioGroup>
      <FormGroup row>
        <InputLabel>Animation</InputLabel>
        <Switch
          checked={settings.animation}
          onChange={(e) => {
            localStorage.setItem("animation", String(!animation));
            setSettings({ ...settings, animation: !animation })
          }}
        />
      </FormGroup>
      <FormGroup row>
        <InputLabel>Sound</InputLabel>
        <Switch
          checked={settings.sound}
          onChange={(e) => {
            localStorage.setItem("sound", String(!sound));
            setSettings({ ...settings, sound: !sound })
          }}
        />
      </FormGroup>
    </div>
  );
}

export default Settings;
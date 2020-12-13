import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import { Button, FormControlLabel, InputLabel, Radio, RadioGroup } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import useThemeSettings from '../../hooks/useThemeSettings';

import "./style.scss";

import { SettingsProps } from './types';
import { SettingsOnoffSwitch } from './SettingsOnoffSwitch';

function Settings(props: SettingsProps) {
  const { settings, setSettings } = props;
  const { theme, animation, sound, hovertips } = settings;
  const history = useHistory();
  const { theme: THEME, sounds: { switch_on, swoosh } } = useThemeSettings();

  return (
    <div className="Settings" style={{ backgroundColor: THEME.color.light }}>
      <div className="Settings-header" style={{ backgroundColor: THEME.color.dark, color: THEME.palette.text.secondary }}>Settings</div>
      <div className="Settings-content">
        <RadioGroup name="theme" value={theme} row className="Settings-content-group" style={{ backgroundColor: THEME.color.base }}>
          <InputLabel className="Settings-content-group-label">Theme</InputLabel>
          {["dark", "light"].map((_theme, index) => <FormControlLabel onClick={(e: any) => {
            if (settings.sound) switch_on.play();
            setSettings({ ...settings, theme: theme === "dark" ? "light" : "dark" })
          }} key={_theme.toString() + index} value={_theme} control={<Radio color="primary" />} label={_theme === "dark" ? <BsMoon className="Settings-icon Settings-icon--theme" style={{ fill: THEME.color.opposite_dark }} /> : <BsSun className="Settings-icon Settings-icon--theme" style={{ fill: THEME.color.opposite_dark }} />} />)}
        </RadioGroup>
        <SettingsOnoffSwitch prop={"animation"} settings={settings} setSettings={setSettings} />
        <SettingsOnoffSwitch prop={"sound"} settings={settings} setSettings={setSettings} />
        <SettingsOnoffSwitch prop={"hovertips"} settings={settings} setSettings={setSettings} />
        <Button variant="contained" color="primary" className="Settings-content-button" onClick={() => {
          localStorage.setItem("SETTINGS", JSON.stringify({
            sound: String(sound),
            animation: String(animation),
            hovertips: String(hovertips),
            theme
          }))
          if (settings.sound) swoosh.play();
          history.push("/")
        }}>Back to Home</Button>
      </div>
    </div>
  );
}

export default Settings;

export * from "./types"

export * from "./SettingsOnoffSwitch"
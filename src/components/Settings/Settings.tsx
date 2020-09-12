import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

import Icon from "../Basic/Icon"
import { SettingsProps } from '../../types';

function Settings(props: SettingsProps) {
  const { settings, setSettings } = props;
  const { theme, animation, sound } = settings;

  return (
    <div className="Settings">
      <div className="Theme-icons" style={{ position: "absolute" }}>
        <Icon className="Settings-icon Settings-icon--theme" style={{ display: theme === "light" ? "initial" : 'none', fill: "black" }} popoverText={`Click to change theme to dark theme`} icon={BsSun} onClick={(e) => {
          localStorage.setItem("THEME", "dark");
          setSettings({ ...settings, theme: "dark" })
        }} />
        <Icon className="Settings-icon Settings-icon--theme" style={{ display: theme === "dark" ? "initial" : 'none', fill: "white" }} popoverText={`Click to change theme to light theme`} icon={BsMoon} onClick={(e) => {
          localStorage.setItem("THEME", "light");
          setSettings({ ...settings, theme: "light" })
        }} />
      </div>
    </div>
  );
}

export default Settings;
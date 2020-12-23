import { capitalize, FormGroup, InputLabel } from '@material-ui/core';
import React from 'react';

import { useThemeSettings } from '../../../hooks'
import { OnoffSwitch } from '../../Basic/Switch/OnoffSwitch';
import { SettingsSwitchProps } from './types';

export function SettingsOnoffSwitch(props: SettingsSwitchProps) {
  const { settings, prop, setSettings } = props;
  const { theme: THEME, sounds: { switch_on, switch_off } } = useThemeSettings();

  return <FormGroup row className="Settings-content-group" style={{ backgroundColor: THEME.color.base }}>
    <InputLabel className="Settings-content-group-label">{capitalize(prop)}</InputLabel>
    <OnoffSwitch
      checked={Boolean(settings[prop])}
      onChange={() => {
        if (!settings[prop] && settings.sound) switch_on.play();
        else if (settings[prop] && settings.sound) switch_off.play();
        setSettings({ ...settings, [prop]: !settings[prop] })
      }}
    />
  </FormGroup>
}

export * from "./types";

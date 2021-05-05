import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from "notistack";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Play, Settings, SettingsContext, SettingsState } from "./components";
import './index.scss';
import { ExtendedTheme } from './types';
import { generateTheme } from "./utils";

const App = () => {
  const local_storage_value = localStorage.getItem("REINFORZ_SETTINGS");
  const local_settings = local_storage_value ? JSON.parse(local_storage_value) : {};
  local_settings.animation = (local_settings?.animation === "true" ? true : false);
  local_settings.sound = (local_settings?.sound === "true" ? true : false);
  local_settings.hovertips = local_settings?.hovertips === "true" ? true : false;
  local_settings.theme = local_settings?.theme ?? "dark";

  const [settings, setSettings] = useState(local_settings as SettingsState);
  const generatedTheme = generateTheme(settings.theme) as ExtendedTheme;

  return <ThemeProvider theme={generatedTheme}>
    <SnackbarProvider maxSnack={4}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <div className={`App ${generatedTheme.palette.type === "dark" ? "dark" : "light"}`} style={{ backgroundColor: generatedTheme.color.dark }}>
          <Switch>
            <Route exact path="/" component={Play} />
            <Route exact path="/settings" component={Settings} />
          </Switch>
        </div>
      </SettingsContext.Provider>
    </SnackbarProvider>
  </ThemeProvider>
}


ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <App />
  </Router >,
  document.getElementById('root'));
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Play, Settings, SettingsState, SettingsContext } from "./components"

import { generateTheme } from "./utils";

import { ExtendedTheme } from './types';

import './index.scss';

const App = () => {
  const lsvalue = localStorage.getItem("SETTINGS");
  const local_settings = lsvalue ? JSON.parse(lsvalue) : {} as SettingsState;
  local_settings.animation = (local_settings?.animation === "true" ? true : false);
  local_settings.sound = (local_settings?.sound === "true" ? true : false);
  local_settings.hovertips = local_settings?.hovertips === "true" ? true : false;
  local_settings.theme = local_settings?.theme ?? "dark";

  const [settings, setSettings] = useState(local_settings);
  const generatedTheme = generateTheme(settings.theme) as ExtendedTheme;

  return <ThemeProvider theme={generatedTheme}>
    <SnackbarProvider maxSnack={4}>
      <DndProvider backend={HTML5Backend}>
        <SettingsContext.Provider value={{ settings, setSettings }}>
          <div className={`App ${generatedTheme.palette.type === "dark" ? "dark" : "light"}`} style={{ backgroundColor: generatedTheme.color.dark }}>
            <Switch>
              <Route exact path="/" component={Play} />
              <Route exact path="/settings" component={Settings} />
            </Switch>
          </div>
        </SettingsContext.Provider>
      </DndProvider>
    </SnackbarProvider>
  </ThemeProvider>
}


ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <App />
  </Router >,
  document.getElementById('root'));
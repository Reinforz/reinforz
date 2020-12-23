import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Play from "./components/Play"
import SettingsContext from "./context/SettingsContext";

import { generateTheme } from "./utils";

import { ExtendedTheme } from './types';

import './index.scss';
import Settings, { SettingsState } from './components/Settings';

const App = () => {
  let local_settings: any = localStorage.getItem("SETTINGS");
  local_settings = local_settings ? JSON.parse(local_settings) : {}
  local_settings.animation = local_settings.animation ? (local_settings.animation === "true" ? true : false) : true;
  local_settings.sound = local_settings.sound ? (local_settings.sound === "true" ? true : false) : true;
  local_settings.hovertips = local_settings.hovertips ? (local_settings.hovertips === "true" ? true : false) : true;
  local_settings.theme = local_settings.theme || "dark";

  const [settings, setSettings] = useState(local_settings as SettingsState);
  const generatedTheme = generateTheme(settings.theme) as ExtendedTheme;

  return <ThemeProvider theme={generatedTheme}>
    <SnackbarProvider maxSnack={4}>
      <DndProvider backend={HTML5Backend}>
        <SettingsContext.Provider value={settings}>
          <div className={`App ${generatedTheme.palette.type === "dark" ? "dark" : "light"}`} style={{ backgroundColor: generatedTheme.color.dark }}>
            <Switch>
              <Route exact path="/" render={() => <Play />} />
              <Route exact path="/settings" render={() => <Settings settings={settings} setSettings={setSettings} />} />
            </Switch>
          </div>
        </SettingsContext.Provider>
      </DndProvider>
    </SnackbarProvider>
  </ThemeProvider>
}

const Index = () => {
  return <Router basename={process.env.PUBLIC_URL}>
    <App />
  </Router >
};

ReactDOM.render(<Index />, document.getElementById('root'));
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Play from "./components/Play/Play"
import SettingsContext from "./context/SettingsContext";

import generateTheme from "./utils/theme";

import { ExtendedTheme, ISettings, AllowedTheme } from './types';

import './index.scss';
import Settings from './components/Settings/Settings';

const App = () => {
  const animation = localStorage.getItem("animation");
  const sound = localStorage.getItem("sound");
  const hovertips = localStorage.getItem("hovertips");
  const [settings, setSettings] = useState({
    theme: (localStorage.getItem('THEME') || 'dark') as AllowedTheme,
    animation: animation ? (animation === "true" ? true : false) : true,
    sound: sound ? (sound === "true" ? true : false) : true,
    hovertips: hovertips ? (hovertips === "true" ? true : false) : true
  } as ISettings);
  const generatedTheme = generateTheme(settings.theme) as ExtendedTheme;

  return <ThemeProvider theme={generatedTheme}>
    <SnackbarProvider maxSnack={4}>
      <SettingsContext.Provider value={settings}>
        <div className={`App ${generatedTheme.palette.type === "dark" ? "dark" : "light"}`} style={{ backgroundColor: generatedTheme.color.dark }}>
          <Switch>
            <Route exact path="/" render={() => <Play />} />
            <Route exact path="/settings" render={() => <Settings settings={settings} setSettings={setSettings} />} />
          </Switch>
        </div>
      </SettingsContext.Provider>
    </SnackbarProvider>
  </ThemeProvider>
}


const Index = () => {
  return <Router>
    <App />
  </Router >
};

ReactDOM.render(<Index />, document.getElementById('root'));
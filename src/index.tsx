import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { FcSettings } from "react-icons/fc";

import Play from "./components/Play/Play"

import generateTheme from "./utils/theme";

import { ExtendedTheme, ISettings, AllowedTheme } from './types';

import './index.scss';
import Settings from './components/Settings/Settings';
import Icon from './components/Basic/Icon';


const Index = () => {
  const [settings, setSettings] = useState({
    theme: (localStorage.getItem('THEME') || 'dark') as AllowedTheme,
    animation: true,
    sound: true
  } as ISettings);
  const generatedTheme = generateTheme(settings.theme) as ExtendedTheme;
  return <Router>
    <ThemeProvider theme={generatedTheme}>
      <SnackbarProvider maxSnack={4}>
        <div className={`App ${generatedTheme.palette.type === "dark" ? "dark" : "light"}`} style={{ backgroundColor: generatedTheme.color.dark }}>
          <Icon onClick={() => { }} icon={FcSettings} popoverText="Click to go to settings page" className="App-icon App-icon--settings" />
          <Switch>
            <Route exact path="/" render={() => <Play />} />
            <Route exact path="/settings" render={() => <Settings settings={settings} setSettings={setSettings} />} />
          </Switch>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  </Router >
};

ReactDOM.render(<Index />, document.getElementById('root'));
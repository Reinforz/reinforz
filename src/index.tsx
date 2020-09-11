import React, { useState } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Icon from './components/Basic/Icon';
import Play from "./components/Play/Play"

import generateTheme from "./utils/theme";

import './index.css';

const Index = () => {
  const [theme, setTheme] = useState((localStorage.getItem('THEME') || 'dark') as ("dark" | "light"));
  return <Router>
    <ThemeProvider theme={generateTheme(theme)}>
      <SnackbarProvider maxSnack={4}>
        <div className="App">
          <div className="Theme-icons" style={{ position: "absolute" }}>
            <Icon style={{ display: theme === "light" ? "initial" : 'none', fill: "black", fontSize: '1.5em', padding: 2, cursor: 'pointer' }} popoverText={`Click to change theme to dark theme`} icon={BsSun} onClick={(e) => setTheme("dark")} />
            <Icon style={{ display: theme === "dark" ? "initial" : 'none', fill: "white", fontSize: '1.5em', padding: 2, cursor: 'pointer' }} popoverText={`Click to change theme to light theme`} icon={BsMoon} onClick={(e) => setTheme("light")} />
          </div>
          <Switch>
            <Route path="/" render={() => <Play />} />
          </Switch>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  </Router >
};

ReactDOM.render(<Index />, document.getElementById('root'));
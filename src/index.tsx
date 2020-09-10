import React, { useState } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router, withRouter, RouteChildrenProps } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Play from "./components/Play/Play"

import GlobalCss from './utils/globalCSS';
import THEME from "./utils/theme";

import './index.css';
import './App.css';
import Icon from './components/Basic/Icon';

const App = (props: RouteChildrenProps) => {
  const THEME = localStorage.getItem('THEME');

  const [theme, setTheme] = useState(THEME || 'dark');
  const alternate_theme = theme === "dark" ? "light" : "dark"
  const { location } = props;
  return <div className="App">
    <GlobalCss />
    <Icon popoverText={`Click to change theme to ${alternate_theme} theme`} icon={theme === "dark" ? BsMoon : BsSun} onClick={(e) => setTheme(alternate_theme)} />
    <Switch location={location}>
      <Route path="/" render={() => <Play />} />
    </Switch>
  </div>
}
const RoutedApp = withRouter(App);

const Index = () => {
  return <Router>
    <ThemeProvider theme={THEME}>
      <SnackbarProvider maxSnack={4}>
        <RoutedApp />
      </SnackbarProvider>
    </ThemeProvider>
  </Router >
};

ReactDOM.render(<Index />, document.getElementById('root'));
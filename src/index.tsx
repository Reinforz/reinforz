import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router, withRouter, RouteChildrenProps } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Play from "./components/Play/Play"

import GlobalCss from './utils/globalCSS';
import THEME from "./utils/theme";

import './index.css';
import './App.css';

const App = (props: RouteChildrenProps) => {
  const { location } = props;
  return <div className="App">
    <GlobalCss />
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
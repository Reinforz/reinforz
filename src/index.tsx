import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';

import './index.css';
import App from './App';
import THEME from "./utils/theme";

ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <App /></ThemeProvider>,
  document.getElementById('root')
);
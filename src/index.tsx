import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router, withRouter, RouteChildrenProps, NavLink } from "react-router-dom";

import './index.css';
import './App.css';

import THEME from "./utils/theme";
import Quiz from "./components/Quiz"
import Upload from "./components/Upload"

const App = (props: RouteChildrenProps) => {
  let [QuizData, setQuizData] = useState({} as any);
  const { location } = props;
  return <div className="App">
    <NavLink
      to="/upload"
      activeStyle={{
        fontWeight: "bold",
        color: "red"
      }}
    >
      Upload
    </NavLink>
    <NavLink
      to="/quiz"
      activeStyle={{
        fontWeight: "bold",
        color: "red"
      }}
    >
      Quiz
    </NavLink>
    <Switch location={location}>
      <Route exact path="/" render={() => <div>Home</div>} />
      <Route path="/upload" render={() => <Upload currentQuiz={QuizData} setQuiz={setQuizData} />} />
      <Route path="/quiz" render={() => QuizData.title ? <Quiz {...QuizData} /> : <div>No quiz has been uploaded yet</div>} />
    </Switch>
  </div>
}
const RoutedApp = withRouter(App);

const Index = () => {
  return <Router>
    <ThemeProvider theme={THEME}>
      <RoutedApp />
    </ThemeProvider>
  </Router >
};

ReactDOM.render(<Index />, document.getElementById('root'));
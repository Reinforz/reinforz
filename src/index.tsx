import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components";
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, BrowserRouter as Router, withRouter, RouteChildrenProps, NavLink } from "react-router-dom";

import './index.css';
import './App.css';
import THEME from "./utils/theme";
import Quiz from "./components/Quiz"
import Upload from "./components/Upload"

const NavBar = styled.div`
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  font-size: 1.25rem;
`;

const NavBarLink = styled(NavLink)`
  text-decoration: none;
  color: white;
  padding: 5px;
  background: #383838;
  width: 50%;
  text-align: center;
  margin: 5px;
  border-radius: 5px;
`;


const App = (props: RouteChildrenProps) => {
  let [QuizData, setQuizData] = useState({} as any);
  const { location } = props;
  return <div className="App">
    <NavBar>
      <NavBarLink
        to="/upload"
      >
        Upload
      </NavBarLink>
      <NavBarLink
        to="/quiz"
      >
        Quiz
      </NavBarLink>

    </NavBar>
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
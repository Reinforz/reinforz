import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from "notistack";
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Play from "./components/Play/Play";
import Settings from './components/Settings/Settings';
import SettingsContext from "./context/SettingsContext";
import './index.scss';
import { ExtendedTheme } from './types';
import { generateTheme, getSettings } from './utils';

const App = () => {
  const [settings, setSettings] = useState(getSettings());
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

ReactDOM.render(<Router basename={process.env.PUBLIC_URL}>
  <App />
</Router >, document.getElementById('root'));
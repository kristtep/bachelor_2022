import React, { useContext } from 'react';
//import logo from './63cv4n.jpg';
import './App.css';
import SendStream from "./components/SendStream";
import ViewStream from "./components/ViewStream";
import Controls from "./components/Controls";
import { Context } from "./socket";
import Div100vh from "react-div-100vh";
import useLocalStorage from 'use-local-storage';
import { RiSunLine, RiMoonLine } from "react-icons/ri";

const App = () => {

  const { started, startWatch } = useContext(Context);
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

  return (
    <Div100vh>
      <div className="App" data-theme={theme}>
          <Controls>
          <div class="theme-switch-wrapper">
        <label class="theme-switch" for="checkbox">
          
        <input type="checkbox" id="checkbox" onClick={switchTheme}/>
        <div class="slider round">
          {theme === 'dark' ? (
          <RiSunLine id="sun" size={40} />) : 
          (<RiMoonLine id="moon" size={40}/>)
  }
          </div>
        </label>
        </div>
          </Controls>
          
          {started && (
            <SendStream />
          )}
          {startWatch && (
            <ViewStream />
          )}
      </div>
    </Div100vh>
  )
}

export default App;

{/*<button id="switch" onClick={switchTheme}>
            {theme === 'light' ? 'Dark' : 'Light'} Theme
</button> */}

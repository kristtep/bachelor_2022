import React, { useContext } from 'react';
//import logo from './63cv4n.jpg';
import './App.css';
import SendStream from "./components/SendStream";
import ViewStream from "./components/ViewStream";
import Controls from "./components/Controls";
import Home from "./components/Home";
import { Context } from "./socket";
import Div100vh from "react-div-100vh";

const App = () => {

  const { started, startWatch } = useContext(Context);

  return (
    <Div100vh>
      <div className="App">
          {!started && !startWatch && (
            <Home />
          )}


          {started && (
            <>
            <Controls />
            <SendStream />
            </>
          )}
          {startWatch && (
            <>
            <Controls />
            <ViewStream />
            </>

          )}
      </div>
    </Div100vh>
  )
}

export default App;
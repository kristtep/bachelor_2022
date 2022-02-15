import React, { useContext } from 'react';
import logo from './63cv4n.jpg';
import './App.css';
import SendStream from "./components/SendStream";
import ViewStream from "./components/ViewStream";
import Controls from "./components/Controls";
import { Context } from "./socket";

const App = () => {
  
  const { started, startWatch } = useContext(Context);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <p>
            NTNU cracks u up
          </p>
        </div>
        {started && (
          <SendStream />
        )}
        {startWatch && (
          <ViewStream />
        )}
        
        <Controls />
      </header>
    </div>
  );
}

export default App;

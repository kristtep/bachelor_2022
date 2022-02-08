import React from 'react';
import logo from './63cv4n.jpg';
import './App.css';
import VideoStream from "./components/VideoStream";
import Controls from "./components/Controls";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <p>
            NTNU cracks u up
          </p>
        </div>
        <VideoStream />
        <Controls />
      </header>
    </div>
  );
}

export default App;

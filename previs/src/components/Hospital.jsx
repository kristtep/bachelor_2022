import React, { useContext } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import ViewStream from "./ViewStream";
import { socket } from "socket.io-client";

const Hospital = () => {

    const { startW, stateStartWatch, check } = useContext(Context);
    
    const value = useContext(check);
    console.log(value);

  return (
    <div id="hospital">
        {!stateStartWatch && (
        <>
        <h2>Hospital</h2>
        <button id="watch" onClick = {startW}>WATCH</button>
        </>
        )}

        {stateStartWatch && (
            <>
                <Controls />
                <ViewStream />
            </>
          )}
    </div>
  )
}

export default Hospital
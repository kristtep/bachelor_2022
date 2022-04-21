import React, { useContext } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import ViewStream from "./ViewStream";

const Hospital = () => {

    const { startW, stateStartWatch } = useContext(Context);

  return (
    <div id="hospital">
        {!stateStartWatch && (
        <div id="starthospital">
          <h2>Hospital</h2>
          <button id="watch" onClick = {startW}>WATCH</button>
        </div>
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
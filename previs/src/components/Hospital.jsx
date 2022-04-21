import React, { useContext } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import ViewStream from "./ViewStream";

const Hospital = () => {

    const { startW, stateStartWatch } = useContext(Context);

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
import React, { useContext } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import SendStream from "./SendStream";

const Ambulance = () => {

    const { start, stateStart } = useContext(Context);

  return (
    <div id="ambulance">
        {!stateStart && (
        <>
            <h2>Ambulance</h2>
            <button id="startstream"onClick = {start}>START</button>
        </>
        )}

        {stateStart && (
            <>
                <Controls />
                <SendStream />
            </>
          )}
    </div>
  )
}

export default Ambulance;
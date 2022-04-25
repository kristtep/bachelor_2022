import React, { useContext } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import SendStream from "./SendStream";

const Ambulance = () => {

  return (
    <div id="ambulance">
            <>
                <Controls />
                <SendStream />
            </>
    </div>
  )
}

export default Ambulance;
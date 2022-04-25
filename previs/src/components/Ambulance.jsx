import React, { useContext, useEffect } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import SendStream from "./SendStream";

const Ambulance = () => {

  const { setStateStart } = useContext(Context);

  useEffect(() => {
    setStateStart(true);
  });
  

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
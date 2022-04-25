import React, { useContext, useEffect } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import SendStream from "./SendStream";

const Ambulance = () => {

  const { start } = useContext(Context);

  useEffect(() => {
    start();
  }, []);
  
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
import React, { useContext } from 'react';
import { Context } from "../socket";
import Controls from "./Controls";
import ViewStream from "./ViewStream";

const Hospital = () => {

  return (
    <div id="hospital">
            <>
              <Controls />
              <ViewStream />
            </>
    </div>
  )
}

export default Hospital
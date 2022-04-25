import Controls from "./Controls";
import ViewStream from "./ViewStream";
import { Context } from "../socket";
import React, { useContext, useEffect } from "react";

const Hospital = () => {

  const { setStateStartWatch } = useContext(Context);

  useEffect(() => {
    setStateStartWatch(true);
  });

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
import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    const [grid, setGrid] = useState(true);
    const { startWatch, me, vie1, vie2, stream, callEnded, callAccepted } = useContext(Context);
    const largeVideo = () => {
        setGrid(!grid);
    }
    console.log(vie1);


    return (
        <>
        {startWatch && <p>your id: {me}</p>}
        
        {startWatch && callAccepted && !callEnded && (
            <div id="stream">
                {stream && (
                    <div id="firstrow">
                        <video onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted ref={vie1} autoPlay />
                    </div>
                )}
                {/* {stream && (
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline muted ref={vie2} autoPlay />
                    </div>
                )} */}
            </div>
        )}
        </>
    )     

};

export default ViewStream;
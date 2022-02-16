import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    //const [grid, setGrid] = useState(true);
    const { startWatch, me, vie1, vie2, stream, callEnded, callAccepted } = useContext(Context);
    /* const largeVideo = () => {
        setGrid(!grid);
    } */
    console.log(vie1, vie2);


    return (
        <>
        <p>your id: {me}</p>
        {stream && (
            <>
            {startWatch && callAccepted && !callEnded && (
                <div id="stream">   
                    <div id="firstrow">
                        <video width = "600" height = "400" playsInline ref={vie1} autoPlay />
                    </div>
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline muted ref={vie2} autoPlay />
                    </div>            
                </div>
            )}
            </>
        )}
        </>
    )     

};

export default ViewStream;
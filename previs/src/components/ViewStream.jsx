import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    const { startWatch, me, vid1, vid2, vid3, callEnded, callAccepted } = useContext(Context);

    return (
        <>
        <p>your id: {me}</p>
        
            
            {startWatch && callAccepted && !callEnded && (
                <div id="stream">   
                    <div id="firstrow">
                        <video width = "600" height = "400" playsInline ref={vid1} autoPlay />
                        <video width = "600" height = "400" playsInline ref={vid2} autoPlay />
                    </div>
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline ref={vid3} autoPlay />
                        {/* <video width = "600" height = "400" playsInline ref={out1} autoPlay /> */}
                    </div>            
                </div>
            )}
            

        </>
    )     

};

export default ViewStream;
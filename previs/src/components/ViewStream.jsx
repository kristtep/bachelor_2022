import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    //const [grid, setGrid] = useState(true);
    const { startWatch, me, vid1, vid2, vid3, vid4, stream, callEnded, callAccepted } = useContext(Context);
    /* const largeVideo = () => {
        setGrid(!grid);
    } */

    console.log(vid1, vid2, vid3, vid4);

    return (
        <>
        <p>your id: {me}</p>
        {stream && (
            <>
            {startWatch && callAccepted && !callEnded && (
                <div id="stream">   
                    <div id="firstrow">
                        <video width = "600" height = "400" playsInline ref={vid1} autoPlay />
                        <video width = "600" height = "400" playsInline ref={vid2} autoPlay />
                    </div>
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline ref={vid3} autoPlay />
                        <video width = "600" height = "400" playsInline ref={vid4} autoPlay />
                    </div>            
                </div>
            )}
            </>
        )}
        </>
    )     

};

export default ViewStream;
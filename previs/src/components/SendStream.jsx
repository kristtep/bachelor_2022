import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const SendStream = () => {
    
    const [grid, setGrid] = useState(true);
    const { started, vid1, vid2, stream } = useContext(Context);
    const largeVideo = () => {
        setGrid(!grid);
    }
    console.log(stream);


    return (
        <>
        {started && (
            <div id="stream">
                {stream && (
                    <div id="firstrow">
                        <video onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted ref={vid1} autoPlay />
                    </div>
                )}
                {stream && (
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline muted ref={vid2} autoPlay />
                    </div>
                )}
            </div>
        )}
        </>
    )     

};

export default SendStream;
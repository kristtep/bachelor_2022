import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";



const VideoStream = () => {
    
    const [grid, setGrid] = useState(true);
    const { started, localVideo1, localVideo2, stream } = useContext(Context);
    
    const largeVideo = () => {
        setGrid(!grid);
    }

    return (
        <>
        {started && (
            <div id="stream">
                {stream && (
                    <div id="firstrow">
                        <video onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted ref={localVideo1} autoPlay />
                    </div>
                )}
                {stream && (
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline muted ref={localVideo2} autoPlay />
                    </div>
                )}
            </div>
        )}
        </>
    )     

};

export default VideoStream;
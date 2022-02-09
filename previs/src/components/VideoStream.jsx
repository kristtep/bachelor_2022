import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";



const VideoStream = () => {
    
    const [grid, setGrid] = useState(true);
    const { startWatch, started, localVideos, incomingVideo1, incomingVideo2, stream, callAccepted, callEnded } = useContext(Context);
    console.log(localVideos);
    const largeVideo = () => {
        setGrid(!grid);
    }

    return (
        <>
        {started && (
            <div id="stream">
                {stream && (
                    <div id="firstrow">
                        <video onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted ref={localVideos[0]} autoPlay />
                    </div>
                )}
                {stream && (
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline muted ref={localVideos[1]} autoPlay />
                    </div>
                )}
            </div>
        )}
        {startWatch && callAccepted && !callEnded && (
            <div id="stream">
                <div id="firstrow">
                    <video onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted ref={incomingVideo1} autoPlay />
                </div>
                <div id="secondrow">
                    <video width = "600" height = "400" playsInline muted ref={incomingVideo2} autoPlay />
                </div>
            </div>
        )}
        </>
    )     

};

export default VideoStream;
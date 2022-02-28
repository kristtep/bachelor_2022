import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const SendStream = () => {
    
    const [grid, setGrid] = useState(true);
    const { vid1, callAccepted, callEnded, incomingVoice } = useContext(Context);
    const largeVideo = () => {
        setGrid(!grid);
    }


    const track = (num) => {

      setTimeout(() => {
        let src = new MediaStream();
        src.addTrack(vid1.current.getTracks()[num]);
        let video = document.getElementById(`${num}`);
        video.srcObject = src;
        
      
      }, 10000);

    }

    
    return (
        <>
        <div id="stream">
            {vid1 && (
              <>
                <div id="firstrow">
                    <video id="1" onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted src={track(1)} autoPlay />
                    <video id="2" onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted src={track(2)} autoPlay />
                </div>
            
                <div id="secondrow">
                    <video id="3" width = "600" height = "400" playsInline muted src={track(3)} autoPlay />
                    <video id="4" width = "600" height = "400" playsInline muted src={track(4)} autoPlay />
                </div>
            
              </>
            )}
        </div>
        {callAccepted && !callEnded && (
          <div>
            <audio ref={incomingVoice} controls autoPlay />
          </div>
        )}
        </>
    )     

};

export default SendStream;
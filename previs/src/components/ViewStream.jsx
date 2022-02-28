import React, { useState, useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    const { startWatch, me, vid1, callEnded, callAccepted } = useContext(Context);


    const track = (num) => {

        setTimeout(() => {
          let src = new MediaStream();
          src.addTrack(vid1.current.getTracks()[num]);
          let video = document.getElementById(`v${num}`);
          video.srcObject = src;
        
        }, 3000);
  
      }

    return (
        <>
        <p>your id: {me}</p>
        
            
            {startWatch && callAccepted && !callEnded && (
                <div id="stream">   
                    <div id="firstrow">
                        <video id="v1" width = "600" height = "400" playsInline src={track(1)} autoPlay />
                        <video id="v2" width = "600" height = "400" playsInline src={track(2)} autoPlay />
                    </div>
                    <div id="secondrow">
                        <video id="v3" width = "600" height = "400" playsInline src={track(3)} autoPlay />
                        <video id="v4" width = "600" height = "400" playsInline src={track(4)} autoPlay />
                    </div>            
                </div>
            )}
            

        </>
    )     

};

export default ViewStream;
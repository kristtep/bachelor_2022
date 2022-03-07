import React, { useContext } from "react";
import "../styles.css";
import { Context } from "../socket";



const SendStream = () => {
    
    const { vid1, callAccepted, callEnded, incomingVoice } = useContext(Context);

    const toggleFullscreen = (num) => {
        let elem = document.getElementById(num);
        if(elem){

          if(!document.fullscreenElement){
            elem.requestFullscreen()
            .then(() => {})
            .catch(err => {
              alert(`error on try fullscreen mode: ${err.message} (${err.name})`);
            });
          } else {
            document.exitFullscreen();
          }
        }
    }

    const track = (num) => {

      setTimeout(() => {

        let src = new MediaStream();
        src.addTrack(vid1.current.getTracks()[num]);
        let video = document.getElementById(`v${num}`);
        
        video.srcObject = src;

      }, 10000);
    }

    
    return (
        <>
        <div className="stream">             
          <div id="videos">
            <video id="v1" onClick={() => {toggleFullscreen(1)}} playsInline muted src={track(1)} autoPlay />
            <video id="v2" onClick={() => {toggleFullscreen(2)}} playsInline muted src={track(2)} autoPlay />
            <video id="v3" onClick={() => {toggleFullscreen(3)}} playsInline muted src={track(3)} autoPlay />
            <video id="v4" onClick={() => {toggleFullscreen(4)}} width = "640" height = {{ 'max-height': '50%' }} playsInline muted src={track(4)} autoPlay />
            </div>      
        </div>

        {callAccepted && !callEnded && (
          <div>
            <audio ref={incomingVoice} autoPlay />
          </div>
        )}
        </>
    )

};

export default SendStream;
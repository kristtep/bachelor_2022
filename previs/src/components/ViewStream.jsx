import React, { useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    const { startWatch, me, vid1, callEnded, callAccepted } = useContext(Context);

    const toggleFullscreen = (num) => {
        let elem = document.getElementById(`v${num}`);
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
          if(num === 1){
              src.addTrack(vid1.current.getTracks()[0]);
          }
          src.addTrack(vid1.current.getTracks()[num]);
          let video = document.getElementById(`v${num}`);
          video.srcObject = src;
        
        }, 3000);
  
      }

    return (
        <>
        <p>your id: {me}</p>
        
            
            {startWatch && callAccepted && !callEnded && (
                <div className="stream">   
                    <div className="videos">
                        <video id="v1" onClick={() => {toggleFullscreen(1)}} playsInline src={track(1)} autoPlay />
                        <video id="v2" onClick={() => {toggleFullscreen(2)}} playsInline src={track(2)} autoPlay />
                        <video id="v3" onClick={() => {toggleFullscreen(3)}} playsInline src={track(3)} autoPlay />
                        <video id="v4" onClick={() => {toggleFullscreen(4)}} width = "640" height = "480" playsInline src={track(4)} autoPlay />
                    </div>            
                </div>
            )}
            

        </>
    )     

};

export default ViewStream;
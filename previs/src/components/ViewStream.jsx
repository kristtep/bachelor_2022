import React, { useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {
    
    const { startWatch, vid1, callEnded, callAccepted } = useContext(Context);

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
            {startWatch && callAccepted && !callEnded && (
                <div className="stream"></div>
            )}
            
        </>
    )     

};

export default ViewStream;
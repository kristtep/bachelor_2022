import React, { useContext, useEffect } from "react";
import "../styles.css";
import { Context } from "../socket";



const SendStream = () => {
    
    const { vid1, callAccepted, callEnded, incomingVoice, getCameras } = useContext(Context);


    useEffect(() => {
      makeVideoElems();
    }, []);

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

    const makeVideoElems = async () => {

      const tracks = await getCameras();
      console.log(tracks);

      for(let i = 1; i < tracks.length + 1; i++){
        let elem = document.createElement('video');
        elem.setAttribute('id', i);
        
        document.getElementById('stream').appendChild(elem);
        if(i = tracks.length){
          setSrc();
        }
      }
    } 

    const setSrc = async () => {

      const tracks = await getCameras();

      for(let i = 1; i < tracks.length + 1; i++){
        let src = new MediaStream();
        src.addTrack(tracks[i]);
        let video = document.getElementById(`${i}`);
      
        video.srcObject = src;
      }
    }

    
    return (
        <>
        <div id="stream"></div>
        

        {callAccepted && !callEnded && (
          <div>
            <audio ref={incomingVoice} autoPlay />
          </div>
        )}
        </>
    )

};

export default SendStream;
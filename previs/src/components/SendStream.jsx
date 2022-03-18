import React, { useContext, useEffect } from "react";
import "../styles.css";
import { Context } from "../socket";



const SendStream = () => {

    const { shareScreen, vid1, callAccepted, callEnded, incomingVoice, getCameras, connectionRef } = useContext(Context);


    useEffect(() => {
      makeVideoElems();
    }, [shareScreen]);

    const toggleFullscreen = (num) => {
        let elem = document.getElementById(`${num}`);
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

        if(!shareScreen){
          await getCameras();
        }

        if(connectionRef.current){
          console.log(connectionRef.current.streams[0].getTracks());
        }

        let tracks = vid1.current.getVideoTracks();

        console.log(tracks);

        if(tracks){
          console.log(tracks.length);

          for(let i = 1; i < tracks.length + 1; i++){
            if(!document.getElementById(i)){
            let elem = document.createElement('video');
            elem.setAttribute('id', i);
            elem.setAttribute('autoPlay', true);
            elem.onclick = () => toggleFullscreen(i);

            document.getElementById('stream').appendChild(elem);
            setSrc(i);
            }
          }
        }




    }

    const setSrc =  (i) => {

      const tracks = vid1.current.getVideoTracks();

        let src = new MediaStream();
        src.addTrack(tracks[i-1]);
        document.getElementById(`${i}`).srcObject = src;

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
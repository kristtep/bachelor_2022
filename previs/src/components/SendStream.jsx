import React, { useContext, useEffect } from "react";
import "../styles.css";
import { Context } from "../socket";

const SendStream = () => {

    const { shareScreen, vid1, callAccepted, callEnded, incomingVoice, camReady } = useContext(Context);

    useEffect(() => {
      makeVideoElems();
    }, [shareScreen, camReady, callAccepted]);

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

        /* if(!shareScreen){
          await getCameras();
        } */

        /* if(incomingVoice.current){
          console.log(incomingVoice.current.getTracks());
        } */

        console.log(vid1.current);

        if(!incomingVoice.current && !callAccepted){
          let tracks = vid1.current.getVideoTracks();
        
          console.log('inside video making outgoing');

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
        } else if (incomingVoice.current && callAccepted) {
          console.log('inside video making incoming and removing outgoing');
          document.getElementById('1').remove();
          document.getElementById('2').remove();
          if(!document.getElementById("hospital-mirroring")){
            let elem = document.createElement('video');
            elem.setAttribute('id', 'hosptial-mirroring');
            elem.setAttribute('autoPlay', true);

            document.getElementById('incoming-stream').appendChild(elem);
            setSrc('hosptial-mirroring');
          }
        }
    }

    const setSrc = (i) => {

      if(!callAccepted){
        const tracks = vid1.current.getVideoTracks();

        let src = new MediaStream();
        src.addTrack(tracks[i-1]);
        document.getElementById(i).srcObject = src;
      } else if (callAccepted){
        document.getElementById(i).srcObject = incomingVoice.current;
      }
    }

    return (
        <>
        {callAccepted && !callEnded ? (
          <div id="incoming-stream"></div>
        ) : (
          <div id="stream"></div>
        )}
        </>
    )

};

export default SendStream;
import React, { useContext, useEffect } from "react";
import "../styles.css";
import { Context } from "../socket";

const SendStream = () => {

    const { shareScreen, vid1, callAccepted, incomingVoice, camReady } = useContext(Context);

    useEffect(() => {
      console.log(vid1.current);
      let tracks;
      if(vid1.current){
        tracks = vid1.current.getVideoTracks();
      }

      if(tracks){
        console.log('inside first layer video elems');
        console.log(tracks.length);

        for(let i = 1; i < tracks.length + 1; i++){
          if(!document.getElementById(i) && !callAccepted){
            let container = document.createElement('div');
            container.setAttribute('id', `videoContainer-${i}`);
            let elem = document.createElement('video');
            elem.setAttribute('id', i);
            elem.setAttribute('width', '100%');
            elem.setAttribute('height', '100%');
            elem.setAttribute('autoPlay', true);
            elem.onclick = () => toggleFullscreen(i);

            console.log('inside making vid elems');
            
            document.getElementById('stream').appendChild(container);
            document.getElementById(`videoContainer-${i}`).appendChild(elem);
            setSrc(i);
            makeButton(i);
          } else if (callAccepted){
            console.log('inside video making incoming and removing outgoing');
            if(document.getElementById('1')){
              document.getElementById('1').remove();
              document.getElementById('videoContainer-1').remove();
              document.getElementById('2').remove();
              document.getElementById('videoContainer-2').remove();
            }
            if(!document.getElementById("hospital-mirroring")){
              let elem = document.createElement('video');
              elem.setAttribute('id', 'hospital-mirroring');
              elem.setAttribute('autoPlay', true);

              document.getElementById('stream').appendChild(elem);
              setSrc('hospital-mirroring');
            }
          }
        }
      }
    }, [shareScreen, camReady, callAccepted]);

    const toggleFullscreen = (num) => {
        let elem = document.getElementById(`videoContainer-${num}`);
        if(elem){

          if(!document.fullscreenElement){
            elem.requestFullscreen()
            .then(() => {})
            .catch(err => {
              alert(`error on try fullscreen mode: ${err.message} (${err.name})`);
            });
          } 
        }
    }

    const setSrc = (i) => {

      let src = new MediaStream();

      if(i !== 'hospital-mirroring'){
        const tracks = vid1.current.getVideoTracks();

        src.addTrack(tracks[i-1]);
        document.getElementById(i).srcObject = src;
      } else if (incomingVoice.current) {
        console.log(incomingVoice.current.getTracks());
        console.log(i);
        document.getElementById(i).srcObject = incomingVoice.current;
      }
    }

    const makeButton = (i) => {
      let button = document.createElement('button');
      button.innerHTML = 'TILBAKE';
      button.setAttribute('id', 'back');
      button.onclick = () => {
        document.exitFullscreen();
      };
      document.getElementById(`videoContainer-${i}`).appendChild(button);
    }

    return (
        <>
          <div id="stream"></div>
        </>
    )

};

export default SendStream;
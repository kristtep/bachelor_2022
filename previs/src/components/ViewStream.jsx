import React, { useContext, useEffect } from "react";
import "../styles.css";
import 'animate.css';
import { Context } from "../socket";

const ViewStream = () => {

  const { stateStartWatch, vid1, callEnded, callAccepted, shareScreen, status, callRoom } = useContext(Context);

  useEffect(() =>{

    if(callAccepted && vid1.current){
      let tracks = vid1.current.getVideoTracks();

      if(tracks){

        for(let i = 1; i < tracks.length + 1; i++){
          if(!document.getElementById(i)){
          let container = document.createElement('div');
          container.setAttribute('id', `videoContainer-${i}`);
          let elem = document.createElement('video');
          elem.setAttribute('id', i);
          elem.setAttribute('width', '100%');
          elem.setAttribute('height', '100%');
          elem.setAttribute('autoPlay', true);
          elem.setAttribute('muted', false);
          elem.onclick = () => toggleFullscreen(i);

          document.getElementById('vstream').appendChild(container);
          document.getElementById(`videoContainer-${i}`).appendChild(elem);
          setSrc(i);
          makeButton(i);
          }
        }
      }else{
        window.alert('no media tracks detected');
      }
    }
  },[ callAccepted, shareScreen ]);

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

  const setSrc =  (i) => {

    const tracks = vid1.current.getTracks();

      let src = new MediaStream();
      if(i === 1){
        src.addTrack(tracks[0]);
      }
      src.addTrack(tracks[i]);
      document.getElementById(i).srcObject = src;
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
        {!status.ready ? (
          <div id="status">
            <p>Waiting for ambulance to start streaming</p>
            <div id="spinner"></div>
          </div>
        ) : (
          <>
          {!callAccepted && (
            <div id="incoming-call">
              <button class="animate__animated animate__pulse" onClick={() => callRoom(status.room)}>Incoming call from {status.ambulance}</button>
            </div>
          )}
          </>
        )}
            { stateStartWatch && callAccepted && !callEnded && (
              <>

                <div id="vstream"></div>
                </>
            )}
        </>
    )
};

export default ViewStream;
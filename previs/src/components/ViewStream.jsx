import React, { useContext, useEffect } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {

    const { stateStartWatch, vid1, callEnded, callAccepted, shareScreen } = useContext(Context);

    useEffect(() =>{
      makeVideoElems();
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
          } else {
            document.exitFullscreen();
          }
        }
    }

    const makeVideoElems = () => {

      console.log("makevideoelems in view", vid1.current);

      if(callAccepted && vid1.current){
      let tracks = vid1.current.getVideoTracks();

      console.log(tracks);

      if(tracks){
        console.log(tracks.length);

        for(let i = 1; i < tracks.length + 1; i++){
          if(!document.getElementById(i)){
          let container = document.createElement('div');
          container.setAttribute('id', `videoContainer-${i}`);
          let elem = document.createElement('video');
          elem.setAttribute('id', `v${i}`);
          elem.setAttribute('width', '100%');
          elem.setAttribute('height', '100%');
          elem.setAttribute('autoPlay', true);
          elem.onclick = () => toggleFullscreen(i);

          document.getElementById('vstream').appendChild(container);
          document.getElementById(`videoContainer-${i}`).appendChild(elem);
          setSrc(i);
          makeButton(i);
          console.log(i);
          }
        }
      }else{
        window.alert('no media tracks detected');
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
      document.getElementById(`v${i}`).srcObject = src;
  }

  const makeButton = (i) => {
    let button = document.createElement('button');
    button.innerHTML = 'TILBAKE';
    button.setAttribute('id', 'back');
    button.onclick = () => toggleFullscreen(i);
    document.getElementById(`videoContainer-${i}`).appendChild(button);
  }

    return (
        <>
            { stateStartWatch && callAccepted && !callEnded && (
              <>

                <div id="vstream"></div>
                </>
            )}
        </>
    )
};

export default ViewStream;
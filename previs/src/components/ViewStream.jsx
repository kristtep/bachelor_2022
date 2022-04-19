import React, { useContext, useEffect } from "react";
import "../styles.css";
import { Context } from "../socket";

const ViewStream = () => {

    const { startWatch, vid1, callEnded, callAccepted, shareScreen, pc } = useContext(Context);

    useEffect(() =>{
      makeVideoElems();
    },[ callAccepted, shareScreen ]);

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

    const makeVideoElems = () => {

      console.log("makevideoelems in view", vid1.current);

      if(callAccepted && vid1.getTracks() !== 0){
      let tracks = vid1.getVideoTracks();

      console.log(tracks);

      if(tracks){
        console.log(tracks.length);

        for(let i = 1; i < tracks.length + 1; i++){
          if(!document.getElementById(i)){
          let elem = document.createElement('video');
          elem.setAttribute('id', `v${i}`);
          elem.setAttribute('autoPlay', true);
          elem.onclick = () => toggleFullscreen(i);

          document.getElementById('vstream').appendChild(elem);
          setSrc(i);
          console.log(i);
          }
        }
      }else{
        window.alert('no media tracks detected');
      }
    }
  }

  const setSrc =  (i) => {

    const tracks = vid1.getVideoTracks();

      let src = new MediaStream();
      src.addTrack(tracks[i-1]);
      document.getElementById(`v${i}`).srcObject = src;
  }

    return (
        <>
            {startWatch && callAccepted && !callEnded && (
              <>

                <div id="vstream"></div>
                </>
            )}
        </>
    )
};

export default ViewStream;
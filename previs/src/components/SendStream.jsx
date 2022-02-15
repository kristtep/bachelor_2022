import React, { useState, useEffect } from "react";
import "../styles.css";
import { View } from 'react-native';
//import { Context } from "../socket";

const Video = ({ stream }) => {
    const localVideo = React.createRef();
  
    // localVideo.current is null on first render
    // localVideo.current.srcObject = stream;
  
    useEffect(() => {
      // Let's update the srcObject only after the ref has been set
      // and then every time the stream prop updates
      if (localVideo.current) localVideo.current.srcObject = stream;
    }, [stream, localVideo]);
  
    return (
      <View>
        <video style={{ height: 400, width: 600 }} ref={localVideo} autoPlay />
      </View>
    );
  };

  const Test = () => {
    // This would run on every render
    // const videos = [];
  
    const [streams, setStreams] = useState([]);
  
    useEffect(() => {
      // This shouldn't run on every render either
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        setStreams([...streams, stream]);
      });
    }, []);
  
    return (
      <View>
        {
          streams.map(s => <Video stream={s} />)
        }
      </View>
    )
  }
  
  export default Test;

/* const SendStream = () => {
    

    const localVideo = React.createRef();

    const [grid, setGrid] = useState(true);
    const { startWatch, started, videos, incomingVoice, callAccepted, callEnded } = useContext(Context);
    const largeVideo = () => {
        setGrid(!grid);
    }
    console.log(videos);

    useEffect(() => {
        if (localVideo.current) localVideo.current.srcObject = stream
    })


    return (
        <>
        {started && (
            <div id="stream">
                {stream && (
                    <div id="firstrow">
                        <video onClick={largeVideo} width = {grid ? "600" : "1600"} height = {grid ? "400" : "900"} playsInline muted ref={videos[0].video} autoPlay />
                    </div>
                )}
                {stream && (
                    <div id="secondrow">
                        <video width = "600" height = "400" playsInline muted ref={videos.current[1]} autoPlay />
                    </div>
                )}
            </div>
        )}
        {startWatch && callAccepted && !callEnded && (
            <div id="stream">
                <div id="firstrow">
                    <video width = "600" height = "400" playsInline muted ref={incomingVoice} autoPlay />
                </div>
            </div>
        )}
        </>
    )     

};

export default SendStream; */
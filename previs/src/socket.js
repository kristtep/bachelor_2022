import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("https://bachelor-2022.herokuapp.com/");
//"https://bachelor-2022.herokuapp.com/"
//http://localhost:5000/

const ContextProvider = ({ children }) => {
    
    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    let latency = useState(0);
    
    const streams = useRef([]);
    const cameras = [];
    const vid1 = useRef();
    const incomingVoice = useRef([]);
    const connectionRef = useRef();      
    
    useEffect( async () => {
        
        socket.on("id", (id) => setMe(id));
        
        await navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            devices.forEach((device) => {
                if(device.kind === "videoinput"){
                    cameras.push(device.deviceId);
                };
            });
        });
            
        
        if (started) {
            
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[0] } }, audio: true })
                .then((currentStream) => {

                    streams.current.push(currentStream);
                    
                    vid1.current = currentStream;
                });
            
                if (cameras.length > 1){
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] } }, audio: false })
                        .then((currentStream) => {

                            streams.current.push(currentStream);

                            console.log(vid1);

                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);

                            //vid2.current.srcObject = currentStream;
                        });
                }
                if (cameras.length > 2){
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[2] } }, audio: false })
                        .then((currentStream) => {

                            streams.current.push(currentStream);
                            
                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);

                            console.log(vid1.current.getTracks());

                            //track(1);
                            //vid3.current.srcObject = currentStream;
                            
                        });
                }
                
                if (cameras.length > 2) {
                    console.log('last if');
                    navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
                        .then((currentStream) => {

                        streams.current.push(currentStream);
                        console.log(currentStream.getVideoTracks());

                        vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                    });
                }
                    
                
        }
        else if(startWatch){
            navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                .then((currentStream) => {

                    incomingVoice.current.push(currentStream);
                });
        }

        socket.on("callHospital", ({ from, signal }) => {
            setCall({ incomingCall: true, from, signal });
        });
    }, [started, startWatch]);

    const callHospital = (id) => {

        const peer = new Peer({ 
            initiator: true,
            channelConfig: latency, 
            trickle: false, 
            stream: vid1.current
        });

        peer.on("signal", (data) => {
            console.log("signal call: " + Date.now()/1000);
            socket.emit("callHospital", { hospitalId: id, signalData: data, from: me });
        });

        peer.on('stream', (stream) => {
            console.log("stream call: " + Date.now()/1000);

            incomingVoice.current.srcObject = stream;            
        });

        socket.on("callAccepted", (signal) => {
            
            console.log("call accepted from call: " + Date.now()/1000);
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const answer = () => {
        setCallAccepted(true);
        const peer = new Peer({ 
            initiator: false, 
            trickle: false, 
            streams: incomingVoice.current 
        });

        peer.on("signal", (data) => {

            console.log("signal answer: " + Date.now()/1000);
            socket.emit("answer", { signal: data, to: call.from });
        });

        peer.on('stream', (streams) => {
            console.log("stream answer: " + Date.now()/1000);
            vid1.current = streams;
                
        });
        
        console.log("incoming signal: " + Date.now()/1000);

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const end = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }

    const startW = () => {
        setStartWatch(true);
    }

    const start = () => {
        setStarted(true);
    }

    return (
        <Context.Provider value={{
            startWatch,
            started,
            call,
            callAccepted,
            callEnded,
            incomingVoice,
            me,
            cameras,
            streams,
            vid1,
            callHospital,
            answer,
            end,
            start,
            startW,
        }}>
            { children }
        </Context.Provider>
    );

};

export { ContextProvider, Context };

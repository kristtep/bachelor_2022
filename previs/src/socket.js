import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("http://localhost:5000/");
//"https://bachelor-2022.herokuapp.com/"


const ContextProvider = ({ children }) => {
    
    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const streams = useRef([]);
    const cameras = [];
    const vid1 = useRef();
    const vid2 = useRef();
    const vid3 = useRef();
    const vid4 = useRef();
    const incomingVoice = useRef([]);
    const connectionRef = useRef();
            
    
    useEffect( async () => {
        
        socket.on("id", (id) => setMe(id));
        
        await navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            devices.forEach((device) => {
                if(device.kind === "videoinput"){
                    console.log(device);
                    cameras.push(device.deviceId);
                };
            });
        });
            
        
        console.log(cameras);

        if (started) {
            
            /* for( let i = 0; i < cameras.length; i++) {
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[i] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: true })
                        .then((currentStream) => {
                            setStream([...stream, currentStream]);
                        });
            } */
            console.log('initiator');
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[0] }, width: { ideal: 4096 }, height: { ideal: 2160 } }, audio: true })
                .then((currentStream) => {

                    streams.current.push(currentStream);
                    
                    vid1.current.srcObject = currentStream;
                });
            
                if (cameras.length > 1){
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: { ideal: 4096 }, height: { ideal: 2160 } }, audio: false })
                        .then((currentStream) => {

                            streams.current.push(currentStream);

                            vid2.current.srcObject = currentStream;
                        });
                }
                if (cameras.length > 2){
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[2] }, width: { ideal: 4096 }, height: { ideal: 2160 } }, audio: false })
                        .then((currentStream) => {

                            streams.current.push(currentStream);

                            vid3.current.srcObject = currentStream;
                        });
                }
                
                if (cameras.length > 3) {
                    console.log('last if');
                    console.log(cameras[3]);
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[3] }, width: { ideal: 4096 }, height: { ideal: 2160 } }, audio: false })
                        .then((currentStream) => {

                        streams.current.push(currentStream);

                        vid4.current.srcObject = currentStream;
                    });
                }
                    
                
        }
        else if(startWatch){
            console.log('reciever');
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
        console.log('inside call function');
        console.log(streams.current);
        const peer = new Peer({ 
            initiator: true, 
            trickle: false, 
            streams: streams.current
        });

        peer.on("signal", (data) => {
            console.log('peer on signal call');
            socket.emit("callHospital", { hospitalId: id, signalData: data, from: me });
        });

        peer.on('stream', (stream) => {
            console.log('inside peer on streams call');
            console.log(stream);

            incomingVoice.current.srcObject = stream;
            
        });

        socket.on("callAccepted", (signal) => {
            
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const answer = () => {
        console.log("inside answer function");
        setCallAccepted(true);
        console.log(vid1);
        console.log(vid2);

        const peer = new Peer({ 
            initiator: false, 
            trickle: false, 
            streams: incomingVoice.current 
        });

        peer.on("signal", (data) => {
            console.log('peer on signal answer');
            console.log(vid1);
            console.log(vid2);

            socket.emit("answer", { signal: data, to: call.from });
        });

        peer.on('stream', (streams) => {
            console.log('inside peer on streams answer');
            console.log(streams);
            
            console.log(vid1.current);
            console.log(vid2.current);

            if (!vid1.current){
                console.log('if');
                vid1.current.srcObject = streams;
                  
            }else if (!vid2.current){
                vid2.current.srcObject = streams;
                console.log('elseif1');
            }else if (!vid3.current){
                vid3.current.srcObject = streams;
                console.log('elseif2');
            }else if (!vid4.current){
                vid4.current.srcObject = streams;
                console.log('elseif3');
            }           
        });

        console.log('before peer connection');

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
            setStartWatch,
            started,
            call,
            callAccepted,
            callEnded,
            incomingVoice,
            me,
            cameras,
            streams,
            vid1,
            vid2,
            vid3,
            vid4,
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

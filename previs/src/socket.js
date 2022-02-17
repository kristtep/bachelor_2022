import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("http://localhost:5000/");
//"https://bachelor-2022.herokuapp.com/"


const ContextProvider = ({ children }) => {
    
    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [stream, setStream] = useState();
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const streams = useRef([]);
    const cameras = [];
    const vid1 = useRef();
    const vid2 = useRef();
    const vie1 = useRef();
    const vie2 = useRef();
    const incomingVoice = useRef([]);
    const connectionRef = useRef();
            
    
    useEffect( async () => {

        await navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            devices.forEach((device) => {
                if(device.kind === "videoinput"){
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
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[0] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);

                    streams.current.push(currentStream);
                    console.log(streams);
                    
                    vid1.current.srcObject = currentStream;
                });
            
                if (cameras.length > 1){
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: false })
                        .then((currentStream) => {
                            setStream(currentStream);

                            streams.current.push(currentStream);
                            console.log(streams);
                            console.log(currentStream);
                            console.log(stream);

                            vid2.current.srcObject = currentStream;
                        });
                }
        }
        else if(startWatch){
            console.log('reciever');
            navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);

                    incomingVoice.current.push(currentStream);
                });
        }
        
        socket.on("id", (id) => setMe(id));

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
        console.log(vie1);
        console.log(vie2);

        const peer = new Peer({ 
            initiator: false, 
            trickle: false, 
            streams: incomingVoice.current 
        });

        peer.on("signal", (data) => {
            console.log('peer on signal answer');
            console.log(vie1);
            console.log(vie2);

            socket.emit("answer", { signal: data, to: call.from });
        });

        peer.on('stream', (streams) => {
            console.log('inside peer on streams answer');
            console.log(streams);
            
            console.log(vie1.current.srcObject);
            console.log(vie2.current.srcObject);

            if (!vie1.current.srcObject){
                vie1.current.srcObject = streams;
                console.log('if');  
            }else{
                vie2.current.srcObject = streams;
                console.log('else');
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
            stream,
            vid1,
            vid2,
            vie1,
            vie2,
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

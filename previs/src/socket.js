import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("http://localhost:5000/");
//"https://bachelor-2022.herokuapp.com/"


const ContextProvider = ({ children }) => {
    
    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [stream, setStream] = useState([]);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccpeted, setCallAccpeted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const cameras = [];
    const vid1 = useRef();
    const vid2 = useRef();
    const vie1 = useRef();
    const vie2 = useRef();
    const incomingVoice = useRef();
    const connectionRef = useRef();
            
    
    useEffect( async () => {

        await navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
            devices.forEach((device) => {
                if(device.kind === "videoinput"){
                    console.log(device.label);
                    cameras.push(device.deviceId);
                };
            });
        });
            
        /* for( let i = 0; i < cameras.length; i++) {
                navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[i] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: true })
                    .then((currentStream) => {
                        setStream([...stream, currentStream]);
                    });
        } */
        console.log(cameras);

        if (started) {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[0] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: true })
                .then((currentStream) => {
                    setStream([...stream, currentStream]);
                    
                    vid1.current.srcObject = currentStream;
                });
            
                if (cameras.length > 1){
                    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: false })
                        .then((currentStream) => {
                            setStream([...stream, currentStream]);

                            vid2.current.srcObject = currentStream;
                        });
                }
        }
        else if(startWatch){
            navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                });
        }
        
        socket.on("id", (id) => setMe(id));

        socket.on("callHospital", ({ from, signal }) => {
            setCall({ incomingCall: true, from, signal });
        });
    }, [started, startWatch]);

    const callHospital = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("callHospital", { hospitalId: id, signalData: data, from: me });
        });

        peer.on('stream', (stream) => {
            console.log(stream);
            vie1.current.srcObject = vid1;
            vie2.current.srcObject = vid2;
        });

        socket.on("callAccepted", (signal) => {
            setCallAccpeted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const answer = () => {
        console.log("inside answer function");
        setCallAccpeted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("answer", { signal: data, to: call.from });
        });

        peer.on('stream', (vid1, vid2) => {
            vie1.current.srcObject = vid1;
            vie2.current.srcObject = vid2;
        })

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
            callAccpeted,
            callEnded,
            incomingVoice,
            me,
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

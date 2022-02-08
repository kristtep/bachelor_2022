import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("ws://localhost:5000");



const ContextProvider = ({ children }) => {
    
    const [started, setStarted] = useState(false);
    const [stream, setStream] = useState();
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccpeted, setCallAccpeted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const cameras = [];
    const localVideo1 = useRef();
    const localVideo2 = useRef();
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
            
        
        console.log(cameras);

        if(started){
            navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[0] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                    
                    localVideo1.current.srcObject = currentStream;
                });
            
            if(cameras.length > 1){
                navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: false })
                .then((currentStream) => {
                    setStream(currentStream);

                    localVideo2.current.srcObject = currentStream;
                });

            }
        }
        
        socket.on("id", (id) => setMe(id));

//        console.log(me);

        socket.on("call", ({ from, signal }) => {
            setCall({ incomingCall: true, from, signal });
        });
    }, [started]);

    const callHospital = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("callHospital", { hospitalId: id, signalData: data, from: me });
        });

        peer.on("callAccepted", (signal) => {
            setCallAccpeted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const answer = () => {
        setCallAccpeted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("answer", { signal: data, to: call.from });
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const end = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }


    return (
        <Context.Provider value={{
            started,
            setStarted,
            call,
            callAccpeted,
            callEnded,
            localVideo1,
            localVideo2,
            me,
            stream,
            callHospital,
            answer,
            end,
        }}>
            { children }
        </Context.Provider>
    );

};

export { ContextProvider, Context };

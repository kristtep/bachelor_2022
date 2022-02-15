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
            
        
        console.log(cameras);

        if(started){
            for( let i = 0; i < cameras.length; i++) {
                navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[i] }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: true })
                    .then((currentStream) => {
                        setStream([...stream, currentStream]);
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
    }, [started]);

    const callHospital = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("callHospital", { hospitalId: id, signalData: data, from: me });
        });

        peer.on('stream', (currentStream) => {
            incomingVoice.current.srcObject = currentStream;
        });

        socket.on("callAccepted", (signal) => {
            setCallAccpeted(true);
            setStartWatch(true);

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

        peer.on('stream', (currentStream) => {
            incomingVoice.current.srcObject = currentStream;
        })

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const end = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
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
            videos,
            incomingVoice,
            me,
            stream,
            callHospital,
            answer,
            end,
            start,
        }}>
            { children }
        </Context.Provider>
    );

};

export { ContextProvider, Context };

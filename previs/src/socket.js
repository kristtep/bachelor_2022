import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("ws://localhost:5000");

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState();
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccpeted, setCallAccpeted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const localVideo1 = useRef();
    const localVideo2 = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                devices.forEach(function(device) {
                    if(device.kind === "videoinput"){
                        console.log(device.label + "id = " + device.deviceId);
                    }
                });
            })

        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: "2e00a0440e4a3fcc24b460fe22c6282c8747599f836fd18bd724921b031a538a" }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: false })
            .then((currentStream) => {
                setStream(currentStream);

                localVideo1.current.srcObject = currentStream;
            });

        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: "dd21ac532aa38f08283f9735c6df79970c6ccc1df9fa7764dd2d459f7c9f0b94" }, width: { exact: 1920 }, height: { exact: 1080 } }, audio: false })
        .then((currentStream) => {
            setStream(currentStream);

            localVideo2.current.srcObject = currentStream;
        });


        socket.on("id", (id) => setMe(id));

        socket.on("call", ({ from, signal }) => {
            setCall({ incomingCall: true, from, signal });
        });
    }, []);

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

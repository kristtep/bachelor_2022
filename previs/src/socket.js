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
    const [shareScreen, setShareScreen] = useState(false);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const streams = useRef([]);
    const cameras = [];
    const vid1 = useRef();
    const incomingVoice = useRef([]);
    const connectionRef = useRef();

    useEffect(() => {
        socket.on("id", (id) => setMe(id));

        socket.on("callHospital", ({ from, signal }) => {
            setCall({ incomingCall: true, from, signal });
        });
    }, []);

    const startShareScreen = () => {
        console.log('shareScreen');
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
            .then((currentStream) => {
                console.log(connectionRef.current);
                if(connectionRef.current){
                    console.log('peer connected');
                    vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                    connectionRef.current.addTrack(currentStream.getVideoTracks()[0], vid1.current);
                    setShareScreen(true);
                    streams.current.push(currentStream);
                }else{
                    console.log('else');
                    streams.current.push(currentStream);
                    console.log(currentStream.getVideoTracks()[0]);
                    vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                    setShareScreen(true);
                }
        });
    }

    const callHospital = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: vid1.current
        });
        
        peer.on('onaddtrack', async (track) => {
            console.log('ontrack');
            console.log(track);  
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
        const peer = new Peer({
            initiator: false,
            trickle: false,
            streams: incomingVoice.current
        });
        
        peer.on('track', (track, stream) => {
            console.log('ontrack');
            console.log(stream);
            console.log(track);
            if(!vid1.current){
                vid1.current = stream;
                vid1.current.addTrack(track);
                setCallAccepted(true);
            }else{
                vid1.current.addTrack(track);
            }
        });

        peer.on("signal", (data) => {
            console.log("signal answer: " + Date.now()/1000);
            socket.emit("answer", { signal: data, to: call.from });      
        });

        /* peer.on('stream', (streams) => {
            console.log("stream answer: " + Date.now()/1000);
            vid1.current = streams;
            setCallAccepted(true);   
        }); */

        

        console.log("incoming signal: " + Date.now()/1000);

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const end = () => {
        setCallEnded(true);

        if(connectionRef.current){
            connectionRef.current.destroy();
        }

        window.location.reload();
    }

    const getCameras = async () => {

        if (cameras.length === 0){
            await navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                devices.forEach((device) => {
                    if(device.kind === "videoinput"){
                        cameras.push(device.deviceId);
                    };
                });
            });

            await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[0] }, width: 1920, height: 1080 }, audio: true })
                .then((currentStream) => {

                    streams.current.push(currentStream);

                    vid1.current = currentStream;
                });

                if (cameras.length > 1){
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: 1920, height: 1080 }, audio: false })
                        .then((currentStream) => {

                            streams.current.push(currentStream);

                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                        });
                }else{
                    return vid1.current.getTracks();
                }
                if (cameras.length > 2){
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[2] }, width: 1920, height: 1080 }, audio: false })
                        .then((currentStream) => {

                            streams.current.push(currentStream);

                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);

                        });
                }else{
                    return vid1.current.getTracks();
                }
            }else{
                window.alert('cameras already set');
            }
    }

    const startW = () => {
        setStartWatch(true);
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((currentStream) => {
                incomingVoice.current.push(currentStream);
            });
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
            shareScreen,
            connectionRef,
            callHospital,
            answer,
            end,
            start,
            startW,
            startShareScreen,
            getCameras,
        }}>
            { children }
        </Context.Provider>
    );

};

export { ContextProvider, Context };

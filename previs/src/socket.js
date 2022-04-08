import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";
import Peer from "simple-peer";

const Context = createContext();
const socket = io("http://localhost:5000/");
//"https://bachelor-2022.herokuapp.com/"
//http://localhost:5000/



const ContextProvider = ({ children }) => {

    const turnStunConfig = {
        iceServers: [
            {
                urls: [ "stun:fr-turn1.xirsys.com" ]
            },
            {
                username: "cAx8DD4EsxnLF5yWJfUflILov81q2YabG4XV87Xj6oUABT8_McfDe1HUcls0VVi3AAAAAGJK1k1rcmlzdHRlcA==",
                credential: "509c1eac-b40a-11ec-8d46-0242ac120004",
                urls: [
                    "turn:fr-turn1.xirsys.com:80?transport=udp",
                    "turn:fr-turn1.xirsys.com:3478?transport=udp",
                    "turn:fr-turn1.xirsys.com:80?transport=tcp",
                    "turn:fr-turn1.xirsys.com:3478?transport=tcp",
                    "turns:fr-turn1.xirsys.com:443?transport=tcp",
                    "turns:fr-turn1.xirsys.com:5349?transport=tcp"
                ]
            }
        ]
    };
<<<<<<< HEAD
    //const [isChannelReady, setIsChannelReady] = useState(false);
    //const [isInitiator, setIsInitiator] = useState(false);
    //const [isStarted, setIsStarted] = useState(false);
    //var pc;
    //var dataChannel;
=======
    const [isChannelReady, setIsChannelReady] = useState(false);
    const [isInitiator, setIsInitiator] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    var pc;
    var turnReady;
    var dataChannel;
    var clientName = "ambulance" + Math.floor(Math.random() * 10 + 1);
    var remoteClient;
    var room = "PreViS";
>>>>>>> 94cc8e8fbd4414d39e88124a5158c085d84871f9

    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [me, setMe] = useState("");
    const [room, setRoom] = useState('');
<<<<<<< HEAD
    //const [users, setUsers] = useState({});
    //const [stream, setStream] = useState();
    const [call, setCall] = useState({});
    //const [caller, setCaller] = useState('');
    //const [callerSignal, setCallerSignal] = useState();
=======
    const [call, setCall] = useState(false);
>>>>>>> 94cc8e8fbd4414d39e88124a5158c085d84871f9
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const streams = useRef([]);
    const cameras = [];
    //endre navn?
    const vid1 = useRef();
    const incomingVoice = useRef([]);
    const connectionRef = useRef();

    useEffect(() => {
        console.log(socket);
<<<<<<< HEAD
        socket.on("id", (id) => setMe(id));

        socket.on("callHospital", ({ from, signal }) => {
            setCall({ incomingCall: true, from, signal });
=======

        socket.on("created", (room) => {
            console.log("room created: " + room);
            setIsInitiator(true);
        });

        socket.on('join', (room, client) => {
            console.log("Another peer (" + client + ") wants to join room " + room + ".");
            setIsChannelReady(true);
            remoteClient = client;
            socket.emit("creatorname", room, clientName);
        });

        socket.on("mynameis", (client) => {
            remoteClient = client;
        });

        socket.on("joined", (room) => {
            setIsChannelReady(true);
            console.log("joined: " + room);
        });

        socket.on("message", (room, message) => {
            console.log("client recieved message: " + message + ". To room " + room);
            if(message === "gotuser"){
                maybeStart();
            } else if(message.type === "offer"){
                if (!isInitiator && !isStarted) {
                    maybeStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            } else if (message.type === "answer" && isStarted) {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === "candidate" && isStarted) {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate,
                });
                pc.addIceCandidate(candidate);
            } else if (message === "bye" && isStarted) {
                handleRemoteHangup();
            }
>>>>>>> 94cc8e8fbd4414d39e88124a5158c085d84871f9
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

<<<<<<< HEAD
    const callHospital = (room) => {

        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: turnStunConfig,
            stream: vid1.current,
        });

        setRoom(room);

        peer.on("signal", (data) => {
            console.log("signal call: " + Date.now()/1000);

            //socket.emit('join-room', room);
            socket.emit("callHospital", { room: room, signalData: data, from: me });
        });

        peer.on('stream', (stream) => {
            console.log("stream call: " + Date.now()/1000);
            incomingVoice.current.srcObject = stream;
        });


        socket.on("callAccepted", (signal) => {

            console.log("call accepted from call: " + Date.now()/1000);
            setCallAccepted(true);
            console.log(call);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const answer = (room) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: turnStunConfig,
            streams: incomingVoice.current
        });

        console.log(call);

        setRoom(room);

        peer.on('track', (track, stream) => {
            console.log('ontrack');
            console.log(stream);
            console.log(track);
            console.log(call.from);
            if(!vid1.current){
                vid1.current = stream;
                vid1.current.addTrack(track);
                setCallAccepted(true);
            }else{
                vid1.current.addTrack(track);
            }
        });

        socket.emit("answer", {room: room});

        peer.on("signal", (data) => {
            console.log("signal answer: " + Date.now()/1000);
            socket.emit("answer", { signal: data, room: room });
        });

        console.log("incoming signal: " + Date.now()/1000);

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

=======
>>>>>>> 94cc8e8fbd4414d39e88124a5158c085d84871f9
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
            room,
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

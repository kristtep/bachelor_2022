import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";

const Context = createContext();
const socket = io("https://bachelor-2022.herokuapp.com/", {
    transports: ['websocket'], 
});
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
    const cameras = [];
    
    var startWatch = false;
    var started = false;
    var isChannelReady = false;
    var isInitiator = false;
    var isStarted = false;
    var clientName = "Ambulance" + Math.floor(Math.random() * 100 + 1);
    var remoteClient;
    var currentRoom;
    const [status, setStatus] = useState({ ready: false, room: '', ambulance: '' });
    const [room, setRoom] = useState('');
    const [stateStartWatch, setStateStartWatch] = useState(false)
    const [stateStart, setStateStart] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [camReady, setCamReady] = useState(false);
    const [roomActive, setRoomActive] = useState(false);

    const vid1 = useRef();
    const incomingVoice = useRef();
    const pc = useRef();

    useEffect(() => {
        
        socket.on("created", (room) => {
            console.log("room created: " + room);
            setRoomActive(true);
            isInitiator = true;
        });

        socket.on('join', (room, client) => {
            isChannelReady = true;
            remoteClient = client;
            socket.emit("creatorname", room, clientName);
        });

        socket.on("mynameis", (client) => {
            remoteClient = client;
        });

        socket.on("joined", (room) => {
            isChannelReady = true;
            console.log("joined: " + room);
        });

        socket.on("message", (message, room) => {
            currentRoom = room;
            if(message === "gotuser"){
                startConnection();
            } else if(message.type === "offer"){
                if (!isInitiator && !isStarted) {
                    startConnection();
                }
                pc.current.setRemoteDescription(new RTCSessionDescription(message));
                answer();
            } else if (message.type === "answer" && isStarted) {
                pc.current.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === "candidate" && isStarted) {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate,
                });
                pc.current.addIceCandidate(candidate);
            } else if (message === "bye" && isStarted) {
                remoteHangUp();
            }
        });

        socket.on('ready', (room, client) => {
            setStatus({ ready: true, room: room, ambulance: client });
        });

    }, []);

    const sendMessage = (message, room) => {
        socket.emit("message", message, room)
    }

    const startConnection = () => {
        if(!isStarted && isChannelReady) {
            createPeerConnection();
            isStarted = true;
            if(isInitiator) {
                call();
            }
        }
    }

    window.onbeforeunload = () => {
        sendMessage("bye", room);
    }

    const createPeerConnection = () => {
        try {
            pc.current = new RTCPeerConnection(turnStunConfig);
            pc.current.onicecandidate = handleIceCandidate;

            var senderTracks;
            var recieverTracks;

            if(started){
                senderTracks = vid1.current.getTracks();
                for (const track of senderTracks) {
                    pc.current.addTrack(track, vid1.current);
                }
            } else if(startWatch){
                recieverTracks = incomingVoice.current.getTracks();
                let idag = new Date(Date.now());
                    let ms = idag.getMilliseconds();
                    console.log('Time:' + ms);
                for (const track of recieverTracks) {
                    pc.current.addTrack(track, incomingVoice.current);
                }
            }

            pc.current.ontrack = (event) => {
                if(started){
                    incomingVoice.current = event.streams[0];
                    setCallAccepted(true);
                } else if (startWatch) {
                    vid1.current = event.streams[0];
                    setCallAccepted(true);
                    let idag2 = new Date(Date.now());
                    let ms = idag2.getMilliseconds();
                    console.log('Time 2:' + ms);
                }
            };
        } catch (e) {
            console.log("failed to create peer connection: " + e);
            return;
        }
    }

    const handleIceCandidate = (event) => {
        if (event.candidate) {
            sendMessage(
                {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                },
                currentRoom
            );
        } else {
            console.log("end of candidates");
        }
    }

    const handleCreateOfferError = (event) =>{
        console.log("createoffer() error: ", event);
    }

    const call = () => {
        pc.current.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    const answer = () => {
        pc.current.createAnswer().then(
            setLocalAndSendMessage,
            onCreateSessionDescriptionError
        );
    }

    const setLocalAndSendMessage = (sessionDescription) => {
        pc.current.setLocalDescription(sessionDescription);
        sendMessage(sessionDescription, currentRoom);
    }

    const onCreateSessionDescriptionError = (error) => {
        console.log("failed to create session description: " + error);
    }

    const callRoom = (room) => {
        setRoom(room);
        socket.emit("create or join", room, clientName);
        sendMessage("gotuser", room);
        if(isInitiator){
            startConnection();
        }
    }

    const remoteHangUp = async () => {
        await alert("Other side hung up");
        stop();
    }

    const hangUp = () => {
        sendMessage("bye", room);
        stop();
    }

    const stop = () => {
        window.location.href = '../';
    }

    const startShareScreen = () => {

        navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
            .then((currentStream) => {
                console.log(pc.current);
                if(pc.current){
                    vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                    pc.current.addTrack(currentStream.getVideoTracks()[0], vid1.current);
                    setShareScreen(true);
                }else{
                    if(vid1.current){
                        vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                        setShareScreen(true);
                    } else {
                        vid1.current = currentStream;
                        setShareScreen(true);
                    }  
                }
        });
    }

    const startW = async () => {
        startWatch = true;
        setStateStartWatch(true);
        socket.emit('initial connect', 'PreVis');
        await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((currentStream) => {
                incomingVoice.current = currentStream;
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
                .then((currentStream) => {
                    incomingVoice.current.addTrack(currentStream.getVideoTracks()[0]);
                });
            });
    }

    const start = async () => {
        started = true;
        setStateStart(true);
        socket.emit('initial connect', 'PreVis');

        if (cameras.length === 0){
            await navigator.mediaDevices.getUserMedia({audio: true, video: { width: 1920, height: 1080 } });
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
                    vid1.current = currentStream;
                });

                if (cameras.length > 1){
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: 1920, height: 1080 }, audio: false })
                        .then((currentStream) => {
                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                        });
                }else{
                    setCamReady(true);
                    return vid1.current.getTracks();
                }
                if (cameras.length > 2){
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[2] }, width: 1920, height: 1080 }, audio: false })
                        .then((currentStream) => {
                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                            setCamReady(true);
                        });
                }else{
                    setCamReady(true);
                    return vid1.current.getTracks();
                }
            }else{
                window.alert('cameras already set');
            }
    }

    return (
        <Context.Provider value={{
            startWatch,
            started,
            stateStartWatch,
            stateStart,
            camReady,
            callAccepted,
            incomingVoice,
            clientName,
            room,
            cameras,
            vid1,
            shareScreen,
            pc,
            roomActive,
            status,
            setRoomActive,
            hangUp,
            callRoom,
            start,
            startW,
            setStateStart,
            setStateStartWatch,
            startShareScreen,
        }}>
            { children }
        </Context.Provider>
    );
};

export { ContextProvider, Context };

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";

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
    
    var isChannelReady = false;
    var isInitiator = false;
    var isStarted = false;
    var clientName = "ambulance" + Math.floor(Math.random() * 100 + 1);
    var remoteClient;
    var room = "PreViS";
    const [ lmao, setLmao ] = useState(false);
    var startWatch = false;
    const [stateStartWatch, setStateStartWatch] = useState(false)
    var started = false;
    const [stateStart, setStateStart] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [camReady, setCamReady] = useState(false);

    const streams = useRef([]);
    const cameras = [];

    //endre navn?
    const vid1 = useRef();
    const incomingVoice = useRef();
    const pc = useRef();

    useEffect(() => {
        console.log(socket);
        
        socket.on("created", (room, id, check) => {
            console.log("room created: " + room);
            console.log(id);
            if(check < 0 ) {
                setLmao(true);
                console.log(lmao);
            } else {
                setLmao(false);
            }
            console.log(check);
            isInitiator = true;
        });

        socket.on('join', (room, client) => {
            console.log("Another peer (" + client + ") wants to join room " + room + ".");
            isChannelReady = true;
            console.log('channel ready: ' + isChannelReady);
            remoteClient = client;
            socket.emit("creatorname", room, clientName);
        });

        socket.on("mynameis", (client) => {
            remoteClient = client;
            console.log(remoteClient);
        });

        socket.on("joined", (room) => {
            isChannelReady = true;
            console.log("joined: " + room);
        });

        socket.on("message", (message, room) => {
            //console.log("client recieved message: " + message + ". To room " + room);
            if(message === "gotuser"){
                maybeStart();
            } else if(message.type === "offer"){
                if (!isInitiator && !isStarted) {
                    console.log("offer and running maybeStart()");
                    maybeStart();
                }
                console.log("offer and setting remotedesc, and running doAnswer()");
                pc.current.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            } else if (message.type === "answer" && isStarted) {
                pc.current.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === "candidate" && isStarted) {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate,
                });
                pc.current.addIceCandidate(candidate);
            } else if (message === "bye" && isStarted) {
                handleRemoteHangup();
                console.log("remote hang up");
            }
        });

    }, []);

    const sendMessage = (message, room) => {
        //console.log("message: " + message + " to room: " + room);
        socket.emit("message", message, room)
    }

    const maybeStart = () => {
        console.log(">>>maybestart ", isStarted, isChannelReady);
        if(!isStarted && isChannelReady) {
            console.log(">>> creating peer connection");
            createPeerConnection();
            isStarted = true;
            if(isInitiator) {
                doCall();
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
//            pc.current.onnegotiationneeded = handleNegotiationNeeded;
            console.log("created rtcpeerconnection");

            //sending side
            //sjekke ut noe alternativ til datachannel, egen for stream?

            //console.log('vid1: ' + vid1.current, 'incomingvoice :' + incomingVoice.current);
            console.log('started: ' + started, 'startWatch: ' + startWatch);

            var senderTracks;
            var recieverTracks;

            //addTrack funker ikke tror jeg, undefined på konsoll logging av peerconnetion
            if(started){
                senderTracks = vid1.current.getTracks();
                //console.log(senderTracks);
                for (const track of senderTracks) {
                    pc.current.addTrack(track, vid1.current);
                }
            } else if(startWatch){
                recieverTracks = incomingVoice.current.getTracks();
                //console.log(recieverTracks);
                for (const track of recieverTracks) {
                    pc.current.addTrack(track, incomingVoice.current);
                }
            }

            //recieving side
            //error om resolution overload når den prøver å lage ny mediastream, fant ikke noe brukbart på stackoverflow
            pc.current.ontrack = (event) => {
                console.log(event.streams[0].getTracks());
                //console.log(event.track);
                if(started){
                    //console.log('making new stream sender');
                    incomingVoice.current = event.streams[0];
                    //console.log(incomingVoice.current);
                    setCallAccepted(true);   
                } else if (startWatch) {
                    //console.log('making new stream reciever');
                    vid1.current = event.streams[0];
                    setCallAccepted(true);
                }
            };
        } catch (e) {
            console.log("failed to create peer connection: " + e);
            return;
        }
    }

    const handleIceCandidate = (event) => {
        //console.log("icecandidate event: " + event);
        if (event.candidate) {
            sendMessage(
                {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                },
                room
            );
        } else {
            console.log("end of candidates");
        }
    }

    const handleCreateOfferError = (event) =>{
        console.log("createoffer() error: ", event);
    }

    const doCall = () => {
        //console.log("sending offer to peer");
        pc.current.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    const doAnswer = () => {
        //console.log("sending answer to peer");
        pc.current.createAnswer().then(
            setLocalAndSendMessage,
            onCreateSessionDescriptionError
        );
    }

    const setLocalAndSendMessage = (sessionDescription) => {
        pc.current.setLocalDescription(sessionDescription);
        //console.log("setlocalandsendmessage sending message", sessionDescription);
        sendMessage(sessionDescription, room);
    }

    const onCreateSessionDescriptionError = (error) => {
        console.log("failed to create session description: " + error);
    }

    const callRoom = () => {
        socket.emit("create or join", room, clientName);
        sendMessage("gotuser", room);
        if(isInitiator){
            maybeStart();
        }
    }

    const handleRemoteHangup = () => {
        console.log("session terminated");
        stop();
        isInitiator = false;
    }

    const hangUp = () => {
        console.log("Hanging up...");
        setCallEnded(true);
        setStateStart(false);
        setStateStartWatch(false);
        stop();
        sendMessage("bye", room);
    }

    const stop = () => {
        isStarted = false;
        console.log(pc.current);
        pc.current.close();
    }

    const startShareScreen = () => {
        console.log('shareScreen');

        navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
            .then((currentStream) => {
                console.log(pc.current);
                if(pc.current){
                    console.log('peer connected');
                    vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                    pc.current.addTrack(currentStream.getVideoTracks()[0], vid1.current);
                    setShareScreen(true);
                }else{
                    console.log('else');
                    console.log(currentStream.getVideoTracks()[0]);
                    vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                    setShareScreen(true);
                }
        });
    }

    const startW = () => {
        startWatch = true;
        setStateStartWatch(true);
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
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

                    //streams.current.push(currentStream);

                    console.log(currentStream.getTracks());

                    vid1.current = currentStream;
                });

                if (cameras.length > 1){
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[1] }, width: 1920, height: 1080 }, audio: false })
                        .then((currentStream) => {

                            //streams.current.push(currentStream);

                            console.log(currentStream.getTracks());

                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);
                        });
                }else{
                    setCamReady(true);
                    return vid1.current.getTracks();
                }
                if (cameras.length > 2){
                    await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cameras[2] }, width: 1920, height: 1080 }, audio: false })
                        .then((currentStream) => {

                            //streams.current.push(currentStream);

                            vid1.current.addTrack(currentStream.getVideoTracks()[0]);

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
            lmao,
            callAccepted,
            callEnded,
            incomingVoice,
            clientName,
            room,
            cameras,
            streams,
            vid1,
            shareScreen,
            pc,
            clientName,
            hangUp,
            callRoom,
            start,
            startW,
            startShareScreen,
        }}>
            { children }
        </Context.Provider>
    );
};

export { ContextProvider, Context };

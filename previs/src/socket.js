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
    const [isChannelReady, setIsChannelReady] = useState(false);
    const [isInitiator, setIsInitiator] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    var pc;
    var turnReady;
    var dataChannel;
    var clientName = "ambulance" + Math.floor(Math.random() * 10 + 1);
    var remoteClient;
    var room = "PreViS";

    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [me, setMe] = useState("");
    //const [room, setRoom] = useState('');
    const [call, setCall] = useState(false);
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
                //handleRemoteHangup();
                console.log("remote hang up");
            }
        });

    }, []);

    const sendMessage = (room, message) => {
        console.log("message: " + message + " to room: " + room);
        socket.emit("message", room, message)
    }

    const maybeStart = () => {
        console.log(">>>maybestart ", isStarted, isChannelReady);
        if(!isStarted && isChannelReady) {
            console.log(">>> creating peer connection");
            createPeerConnection();
            setIsStarted(true);
            if(isInitiator) {
                doCall();
            }
        }
    }

    window.onbeforeunload = () => {
        sendMessage("bye", room);
    }

    var dataChannel;

    const createPeerConnection = () => {
        try {
            pc = new RTCPeerConnection(turnStunConfig);
            pc.onicecandidate = handleIceCandidate;
            console.log("created rtcpeerconnection");
            
            //sending side
            dataChannel = pc.createDataChannel("filetransfer");
            dataChannel.onmessage = (event) => {
                console.log(event);
            }

            //recieving side
            pc.ondatachannel = (event) => {
                var channel = event.channel;
                channel.onopen = (event) => {
                    channel.send("ANSWEREROPEN");
                };
                channel.onmessage = async (event) => {
                    try {
                        var theMessage = event.data;
                        console.log(theMessage, event);

                    } catch (err) {
                        console.log(err);
                    }
                };
            };
        } catch (e) {
            console.log("failed to create peer connection: " + e);
            return;
        }
    }

    const handleIceCandidate = (event) => {
        console.log("icecandidate event: " + event);
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

    const doCall = () => {
        console.log("sending offer to peer");
        pc.createOffer(setLocalAndSendMessage);
    }

    const doAnswer = () => {
        console.log("sending answer to peer");
        pc.createAnswer().then(
            setLocalAndSendMessage
        );
    }

    const setLocalAndSendMessage = (sessionDescription) => {
        pc.setLocalDescription(sessionDescription);
        console.log("setlocalandsendmessage sending message", sessionDescription);
        sendMessage(sessionDescription, room);
    }

    const callRoom = () => {
        socket.emit("create or join", room, clientName);
        sendMessage("gotuser", room);
        if(isInitiator){
            maybeStart();
        }
    }

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
            clientName,
            room,
            cameras,
            streams,
            vid1,
            shareScreen,
            connectionRef,
            clientName,
            callRoom,
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

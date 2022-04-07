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
    var remoteClient;

    const [startWatch, setStartWatch] = useState(false);
    const [started, setStarted] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    const [me, setMe] = useState("");
    const [room, setRoom] = useState('');
    //const [users, setUsers] = useState({});
    //const [stream, setStream] = useState();
    const [call, setCall] = useState(false);
    //const [caller, setCaller] = useState('');
    //const [callerSignal, setCallerSignal] = useState();
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
        socket.on("id", (id) => setMe(id));

        /* socket.on('allUsers', (users) => {
            setUsers(users);
        }); */

        socket.on("created", (room) => {
            console.log("Created room " + room);
            setIsInitiator(true);
        });

        socket.on('join', (room, client) => {
            setIsChannelReady(true);
            socket.emit("creatorname", room, "Ambulance-60");
        });

        socket.on("joined", (room) => {
            console.log('joined room: ' + room);
            setIsChannelReady(true);
        });

        socket.on('message', (message, room) => {
            console.log("Client recieved message: " + message + " in room: " + room);
            if(message === 'gotuser'){
                maybeStart();
            } else if (message.type === 'offer') {
                if (!isInitiator && !isStarted) {
                    maybeStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            } else if (message.type === 'answer' && isStarted) {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === 'candidate' && isStarted) {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate,
                });
                pc.addIceCandidate(candidate);
            } else if (message === 'end' && isStarted) {
                handleRemoteHangup();
            }
        });





    }, []);

    const sendMessage = (message, room) => {
        console.log("Client sending message: " + message + " from room: " + room);
        socket.emit("message", message, room)
    };

    const maybeStart = () => {
        console.log(">>>maybeStart() ", isStarted, isChannelReady);
        if (!isStarted && isChannelReady) {
            console.log(">>> creating peer connection");
            createPeerConnection();
            setIsStarted(true);
            console.log("isInitiator", isInitiator);
            if (isInitiator) {
                doCall();
            }
        }
    }

    window.onbeforeunload = () => {
       sendMessage('end', room);
    };

    var dataChannel;

    const createPeerConnection = () => {
        try {
            pc = new RTCPeerConnection(turnStunConfig);
            pc.onicecandidate = handleIceCandidate();
            console.log('Created RTCPeerConnection');
            dataChannel = pc.createDataChannel('filetransfer');
            dataChannel.onopen = (event) => {

            };

            dataChannel.onmessage = (event) => {
                console.log("The offerer recieved a message" + event.data);
            };

            dataChannel.onerror = (error) => {
                console.log("data channel error: " + error);
            }

            dataChannel.onclose = (event) => {
                console.log("data channel closed");
            }

            pc.ondatachannel = (event) => {
                var channel = event.channel;
                channel.onopen = (event) => {
                    channel.send("ANSWEREROPEN");
                };
                channel.onmessage = async (event) => {
                    try {
                        var themessage = event.data;
                        console.log(themessage, event);
                    } catch (err) {
                        console.log(err);
                    }
                };
            };
        } catch (e) {
            console.log("Failed to create PeerConnection, exception: " + e.message);
            alert("Cannot create RTCPeerConnection object");
            return;
        }
    }

    const handleIceCandidate = (event) => {
        console.log("icecandidate event: ", event);
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
            console.log("End of candidates");
        }
    }

    const handleCreateOfferError = (error) => {
        console.log("createOffer() error: " + error);
    }

    const doCall = () => {
        console.log("sending offer to peer");
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    const doAnswer = () => {
        console.log('sending answer to peer');
        pc.createAnswer().then(
            setLocalAndSendMessage,
            onCreateSessionDescriptionError
        );
    }

    const setLocalAndSendMessage = (sessionDescription) => {
        pc.setLocalDescription(sessionDescription);
        console.log("setLocalAndSendMessage sending message" + sessionDescription);
        sendMessage(sessionDescription, room);
    }

    const onCreateSessionDescriptionError = (error) => {
        console.log("Failed to create session description: " + error);
    }

    const hangup = () => {
        console.log("hanging up");
        stop();
        sendMessage('end', room);
    }

    const handleRemoteHangup = () => {
        console.log("session terminated");
        stop();
        setIsInitiator(false);
    }

    const stop = () => {
        setIsStarted(false);
        pc.close();
        pc = null;
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

            socket.emit('join-room', room);
            socket.emit("callHospital", { room: room, signalData: data, from: me });
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

    const answer = (room) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: turnStunConfig,
            streams: incomingVoice.current
        });

        setRoom(room);

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
            socket.emit('join-room', room);
            socket.emit("answer", { signal: data, room: room });
        });

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

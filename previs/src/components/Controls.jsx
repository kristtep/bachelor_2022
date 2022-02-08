import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";



const Controls = ( { children } ) => {
    
    const { startWatch, setStartWatch, started, setStarted, me, call, answer, callAccepted, end, callHospital } = useContext(Context);
    const [idToCall, setIdToCall] = useState('');

    const start = () => {
        console.log("start");
        setStarted(true);
        console.log(me);
    }

    const watch = () => {
        console.log("watch");
        setStartWatch(true);
        callHospital(idToCall)
    }

    if(call.incomingCall && !callAccepted){
        answer();
    }

    return (
        <>
        {started && (
            <p>your id: {me}</p>
        )}
        <button onClick = {start}>start stream</button>
        <form noValidate autoComplete = "off">
            {!startWatch ? (
            <>
                <input type = "text" name = "number" placeholder = "Enter id to watch" value = {idToCall} onChange={(e) => setIdToCall(e.target.value)}/>
                <input type = "button" value = "join stream" onClick = {watch} />
            </>
            ) : (
                <input type = "button" value = "leave stream" onClick = {end} />
            )}
        </form>
        {children}
        </>
    )     

};

export default Controls;
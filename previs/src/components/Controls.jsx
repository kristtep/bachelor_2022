import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";



const Controls = ( { children } ) => {
    
    const { startWatch, started, me, call, answer, callAccepted, end, callHospital, start } = useContext(Context);
    const [idToCall, setIdToCall] = useState('');

    return (
        <>
        {call.incomingCall && !callAccepted && (
            <button onClick = {answer}>Allow viewer</button>
        )}

        {!started ? (
            <>
            <button onClick = {start}>start stream</button>
            
            <form noValidate autoComplete = "off">
                {!startWatch ? (
                <>
                    <input type = "text" placeholder = "Enter id to watch" value = {idToCall} onChange={(e) => setIdToCall(e.target.value)}/>
                    <input type = "button" value = "join stream" onClick = {() => callHospital(idToCall)} />
                </>
                ) : (
                    <input type = "button" value = "end stream" onClick = {end} />
                )}
            </form>
            </>
        ) : (
            <div>
                <p>your id: {me}</p>
                <button onClick = {end}>stop stream</button>
            </div>
        )}
        
        
        {children}
        </>
    )     

};

export default Controls;
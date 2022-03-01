import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";



const Controls = ( { children } ) => {
    
    const { startWatch, started, me, call, answer, callAccepted, end, callHospital, start, startW } = useContext(Context);
    const [idToCall, setIdToCall] = useState('');

    return (
        <>
        {call.incomingCall && !callAccepted && (
            <button onClick = {answer}>answer</button>
        )}

            
        {!started && (
            <>
        {!startWatch ? (
            <div id="hospital">
            <p>Lat som du er på sykehuset</p>
            <button id="watch" onClick = {startW}>Watch</button>
            </div>
        ) : (
            
            <button className="control-button" onClick = {end}>stop stream</button>
            
        )}
        </>
        )}

        {!startWatch && (
            <>
        {!started ? (
            <div id="ambulance">
            <p>Lat som at du er i en ambulanse, og DET ER BLOD OVERALT</p>
            <button id="startstream"onClick = {start}>start stream</button> 
            </div>
        ) : (
            <div id="topbar-ambulance">
                    <form noValidate autoComplete = "off">
                        <input type = "text" placeholder = "Enter id to call" value = {idToCall} onChange={(e) => setIdToCall(e.target.value)}/>
                        <input type = "button" className="control-button" value = "Ring" onClick = {() => callHospital(idToCall)} />
                    </form>
                <button className="control-button" id="stop" onClick = {end}>Avslutt</button>
            </div>
        )}
        </>
        )}
        {children}
        </>
    )     

};

export default Controls;
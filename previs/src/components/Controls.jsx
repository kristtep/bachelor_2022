import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";
import { AiFillCloseCircle, AiFillPhone } from "react-icons/ai";



const Controls = ( { children } ) => {
    
    const { startWatch, started, call, answer, callAccepted, end, callHospital, start, startW } = useContext(Context);
    const [idToCall, setIdToCall] = useState('');

    return (
        <>
        {call.incomingCall && !callAccepted && (
            <button className="control-button" onClick = {answer}>Svar</button>
        )}

            
        {!started && (
            <>
        {!startWatch && (
            <div id="hospital">
            <p>Lat som du er på sykehuset</p>
            <button id="watch" onClick = {startW}>Watch</button>
            </div>
        )}

        {callAccepted && (
                <button className="control-button" id="stop" onClick = {end}>Avslutt</button>
        )}
            
        </>
        )}

        {!startWatch && (
            <>
        {!started ? (
            <div id="ambulance">
            <p>Lat som at du er i en ambulanse, og DET ER BLOD OVERALT</p>
            <button id="startstream"onClick = {start}>START</button> 
            </div>
        ) : (
            <div id="topbar-ambulance">
                    <div>
                        <input type = "text" placeholder = "Enter id to call" value = {idToCall} onChange={(e) => setIdToCall(e.target.value)}/>
                        <button className='control-button' onClick={() => callHospital(idToCall)}><p>RING</p><AiFillPhone style={{ fontSize: '30px', color: '#fff'}}/></button>
                    </div>
                <button className="control-button" id="stop" onClick = {end}><AiFillCloseCircle style={{ fontSize: '30px' }}/><p>AVSLUTT</p></button>
            </div>
        )}
        </>
        )}
        {children}
        </>
    )     

};

export default Controls;
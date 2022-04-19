import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';




const Controls = ( { children } ) => {

    const { room, stateStartWatch, stateStart, call, answer, callAccepted, end, callRoom, hangUp, startShareScreen } = useContext(Context);
//    const [idToCall, setIdToCall] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);

    const Menu = () => (
        <>
        <p onClick={() => callRoom()}>AKUTTMOTTAK LILLEHAMMER</p>
        <p><a href="h">SLAGVAKT SI</a></p>
        <p><a href="h">LUFTAMBULANSE</a></p>
        <p><a href="h">ANESTESI LEGEBIL</a></p>
        </>
    );

    return (
        <div id="controls" >
        {call.incomingCall && !callAccepted && (
            <button className="control-button" onClick = {answer}>Svar</button>
        )}

        {!stateStart && (

            <>
            <div>
                <button onClick={() => callRoom()}>Ambulance 60</button>
            </div>
            {room && (
                <div id="watchid">
                <p>your room: {room}</p>
            </div>
            )}
            <button className="control-button" id="stop" onClick = {hangUp}>Avslutt</button>
            </>
        )}

        {!stateStartWatch && (
            <>
            <div id="topbar-ambulance">
                {!callAccepted ? (
                    <div id="call-input">
                        <div id='start-button'>
                            <button className='control-button' onClick={() => setToggleMenu(true)}><p>RING</p></button>
                            <div className='dropdown-menu'>
                            {toggleMenu
                            ? <RiCloseLine color="fff" size={35} onClick={() => setToggleMenu(false)} />
                            : <RiMenuLine color="fff" size={30} onClick={() => setToggleMenu(true)} />}
                            {toggleMenu && (
                                <div className='dropdown-menu_container scale-up-center'>
                                    <div className="dropdown-menu_container-links">
                                        <Menu />
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                    ) : (
                    <div>
                        <p>room: {room}</p>
                    </div>
                )}

                <button className="control-button" onClick={() => startShareScreen()}>Del skjerm</button>
                <button className="control-button" id="stop" onClick = {hangUp}><p>AVSLUTT</p></button>
            </div>
        </>
        )}
        {children}
    </div>
    )
};

export default Controls;
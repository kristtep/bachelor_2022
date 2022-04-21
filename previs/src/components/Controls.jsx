import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";
import { RiMenuLine, RiCloseLine, RiCustomerService2Fill } from 'react-icons/ri';
import { BsFillMicFill, BsMicMuteFill } from 'react-icons/bs';




const Controls = ( { children } ) => {

    const { room, stateStartWatch, stateStart, callAccepted, callRoom, hangUp, startShareScreen, callEnded, clientName } = useContext(Context);
//    const [idToCall, setIdToCall] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);
    const [muted, setMuted] = useState(true);

    const handleToggleMute = () => setMuted(current => !current);

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

        {!stateStart && (

            <>
            <div>
                <button onClick={() => callRoom()}>{room + "  " + clientName}</button>
            </div>
            <div id="mute-caller">
            {room && (
                <div id="callerid">
                    <p>{room}</p><RiCustomerService2Fill className="hodetelefoner"/>
                </div>
            )}
            
            <button className="mute-button" onClick={handleToggleMute}>{muted ?  <BsMicMuteFill size={30}/> : <BsFillMicFill size={30}/>}</button>
            </div>
            <button className="control-button" id="stop" onClick = {hangUp}>AVSLUTT</button>
            
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
                            : <RiMenuLine color="fff" size={35} onClick={() => setToggleMenu(true)} />}
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
                    <div id="callerid">
                        <p>{room}</p><RiCustomerService2Fill className="hodetelefoner"/>
                    </div>
                )}
                <div id="extra-buttons">
                    <button className="extra-buttons" onClick={() => startShareScreen()}>ULTRALYD</button>
                    <button className="extra-buttons" onClick={() => startShareScreen()}>TERMISK</button>
                </div>
                <button className="control-button" id="stop" onClick = {hangUp}><p>AVSLUTT</p></button>
            </div>
        </>
        )}
        {children}
    </div>
    )
};

export default Controls;
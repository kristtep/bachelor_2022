import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";
import { RiMenuLine, RiCloseLine, RiCustomerService2Fill } from 'react-icons/ri';
import { BsMicMute, BsMicMuteFill } from 'react-icons/bs';




const Controls = ( { children } ) => {

    const { clientName, room, stateStartWatch, stateStart, call, answer, callAccepted, end, callRoom, hangUp, startShareScreen } = useContext(Context);
//    const [idToCall, setIdToCall] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);

    const Menu = () => (
        <>
        <p onClick={() => callRoom('sender')}>AKUTTMOTTAK LILLEHAMMER</p>
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
                <button onClick={() => callRoom('reciever')}>Ambulance 60</button>
            </div>
            {room && (
                <div id="callerid">
                <p>{room}</p><RiCustomerService2Fill className="hodetelefoner"/>
                </div>
            )}
            <button className="control-button" id="stop" onClick = {hangUp}>Avslutt</button>
            </>
        )}

        {!stateStartWatch && (
            <>
            <div id="topbar-ambulance">
                {!room ? (
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
                        <p>Room: {room}</p>
                    </div>
                )}

                <button className="control-button" onClick={() => callRoom('sender')}>Del skjerm</button>
                <button className="control-button" id="stop" onClick = {hangUp}><p>AVSLUTT</p></button>
            </div>
        </>
        )}
        {children}
    </div>
    )
};

export default Controls;
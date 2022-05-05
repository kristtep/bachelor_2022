import React, { useContext, useState } from "react";
import { Context } from "../socket";
import { RiMenuLine, RiCloseLine, RiCustomerService2Fill } from 'react-icons/ri';
import { GiSpeakerOff, GiSpeaker } from 'react-icons/gi';

const Controls = ( { children } ) => {

    const { room, stateStartWatch, stateStart, callAccepted, callRoom, hangUp, startShareScreen, roomActive, status } = useContext(Context);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [muted, setMuted] = useState(false);

    function mute () {
        let video;
        if(stateStartWatch){
            video = document.getElementById('1');
        } else {
            video = document.getElementById('hospital-mirroring');
        }
        if(muted) {
            video.muted = false;
            setMuted(false);
        } else {
            video.muted = true;
            setMuted(true);
        }
    }

    const Menu = () => (
        <>
        <p onClick={() => callRoom('akuttmottak-lillehammer')}>AKUTTMOTTAK LILLEHAMMER</p>
        <p onClick={() => callRoom('slagvakt-si')}>SLAGVAKT SI</p>
        <p onClick={() => callRoom('luftambulanse')}>LUFTAMBULANSE</p>
        <p onClick={() => callRoom('anestesi-legebil')}>ANESTESI LEGEBIL</p>
        </>
    );

    return (
        <div id="controls" >
        
        {!stateStart && (
            <>
            {callAccepted && (
                <>
                    <div id="callerid">
                        <p>{status.ambulance}</p><RiCustomerService2Fill className="hodetelefoner"/>
                    </div>
                </>
            )}
            <button className="mute-button" onClick={mute}>{muted ?  <GiSpeakerOff size={30}/> : <GiSpeaker size={30}/>}</button>
            <button className="control-button" id="stop" onClick = {hangUp}>AVSLUTT</button>
            </>
        )}

        {!stateStartWatch && (
            <>
            <div id="topbar-ambulance">
                {!callAccepted ? (
                    <>
                    {!roomActive ? (
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
                    ) : (
                        <div id="callerid">
                            <p>PENDING {room}</p>
                        </div>
                    )}
                    </>
                    ) : (
                        <div id="callerid">
                            <p>{room}</p><RiCustomerService2Fill className="hodetelefoner"/>
                        </div>
                    )}
                    <div id="container">
                    <div id="extra-buttons">
                        <button className="extra-buttons" onClick={() => startShareScreen()}>ULTRALYD</button>
                        <button className="extra-buttons" onClick={() => startShareScreen()}>TERMISK</button>
                    </div>
                        <button className="mute-button" onClick={mute}>{muted ?  <GiSpeakerOff size={30}/> : <GiSpeaker size={30}/>}</button>
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
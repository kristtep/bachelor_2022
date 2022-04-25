import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";
import { RiMenuLine, RiCloseLine, RiCustomerService2Fill } from 'react-icons/ri';
import { BsMicMuteFill, BsFillMicFill } from 'react-icons/bs';

const Controls = ( { children } ) => {

    const { room, stateStartWatch, stateStart, callAccepted, callRoom, hangUp, startShareScreen, callEnded, clientName, incomingVoice, pc, vid1, roomActive } = useContext(Context);
//    const [idToCall, setIdToCall] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);
    const [muted, setMuted] = useState(false);

    function mute () {
        let video = document.getElementById('1');
        console.log(document.getElementsByTagName('video'));
        console.log(pc);
        console.log(pc.current);
        vid1.current.getAudioTracks()[0].enabled = !(vid1.current.getAudioTracks()[0].enabled);
        if(muted) {
            video.muted = false;
            setMuted(false);
        } else {
            video.muted = false;
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
            {!callAccepted ? (
                <>
                        <div id='start-button'>
                            <button className='control-button' onClick={() => setToggleMenu(true)}><p>JOIN</p></button>
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
               
                </>
            ) : (
                <div id="callerid">
                    <p>{room}</p><RiCustomerService2Fill className="hodetelefoner"/>
                </div>
                )}
                 
            <div id="mute-caller">
                <button className="mute-button" onClick={mute}>{muted ?  <BsMicMuteFill size={30}/> : <BsFillMicFill size={30}/>}</button>
            </div>
            <button className="control-button" id="stop" onClick = {hangUp}>AVSLUTT</button>
            
            </>
        )}

        {!stateStartWatch && (
            <>
            <div id="topbar-ambulance">
                {!callAccepted ? (
                    <>
                    {!roomActive ? (
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
                            <p>pending</p>
                        </div>
                    )}
                    </>
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
import React, { useContext, useState } from "react";
import "../styles.css";
import { Context } from "../socket";
import { AiFillCloseCircle, AiFillPhone } from "react-icons/ai";
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';


const Menu = () => (
    <>
      <p><a href="g">AKUTTMOTTAK LILLEHAMMER</a></p>
      <p><a href="h">SLAGVAKT SI</a></p>
      <p><a href="h">LUFTAMBULANSE</a></p>
      <p><a href="h">ANESTESI LEGEBIL</a></p>
    </>
  )

const Controls = ( { children } ) => {

    const { me, startWatch, started, call, answer, callAccepted, end, callHospital, startShareScreen } = useContext(Context);
    const [idToCall, setIdToCall] = useState('');
    const [toggleMenu, setToggleMenu] = useState(false);

    return (
        <div id="controls" >
        {call.incomingCall && !callAccepted && (
            <button className="control-button" onClick = {answer}>Svar</button>
        )}


        {!started && (
            <>
            <div id="watchid">
                <p>your id: {me}</p>
            </div>

        {callAccepted && (
                <button className="control-button" id="stop" onClick = {end}>Avslutt</button>
        )}

        </>
        )}

        {!startWatch && (
            <>

            <div id="topbar-ambulance">
                    <div id="call-input">
                        <div id='start-button'>
                        <button className='control-button' onClick={() => callHospital(idToCall)}><p>RING</p><AiFillPhone style={{ fontSize: '30px', color: '#fff'}}/></button>
                        <div className='dropdown-menu'>
                    {toggleMenu
                        ? <RiCloseLine color="fff" size={27} onClick={() => setToggleMenu(false)} />
                        : <RiMenuLine color="fff" size={27} onClick={() => setToggleMenu(true)} />}
                    {toggleMenu && (
                        <div className='dropdown-menu_container scale-up-center'>
                        <div className="dropdown-menu_container-links">
                        <Menu />
                    </div>
                    </div>
          )}        </div>
                    </div>
                    <input type = "text" placeholder = "Enter id to call" value = {idToCall} onChange={(e) => setIdToCall(e.target.value)}/>
                    </div>
                    <button className="control-button" onClick={() => startShareScreen()}>Del skjerm</button>
                <button className="control-button" id="stop" onClick = {end}><AiFillCloseCircle style={{ fontSize: '30px' }}/><p>AVSLUTT</p></button>
            </div>

        </>
        )}
        {children}
        </div>
    )
};

export default Controls;
import React, { useContext } from 'react';
import { Context } from "../socket";
import "../styles.css";
import { Link } from "react-router-dom";

const Home = () => {

    const { start, startW } = useContext(Context);

    return (
        <div id="home" >
            <header>PreViS</header>
            <div id="welcome">
                <p>Velkommen til PreViS</p>
                <div id="line"></div>
                <p id="orange">Videoassistert beslutningsstøtte i akuttkjeden</p>
            </div>
            <div id="home-container">
            <div id="start">
                <p>Sykehus:</p>
                <Link to="hospital">
                    <button id="watch" onClick = {startW}>WATCH</button>
                </Link>
                
            </div>

            <div id="start">
                <p>Ambulanse:</p>
                <Link to="ambulance">
                    <button id="startstream"onClick = {start}>START</button>
                </Link>
                
            </div>
            </div>
        </div>
    )

};

export default Home;
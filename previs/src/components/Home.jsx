import React, { useContext } from "react";
import "../styles.css";
import { Context } from "../socket";

const Home = () => {

    const { start, startW } = useContext(Context);

    return (
        <div id="home" >
            <div id="hospital">
            <p>Lat som du er på sykehuset</p>
            <button id="watch" onClick = {startW}>Watch</button>
            </div>

            <div id="ambulance">
            <p>Lat som at du er i en ambulanse, og DET ER BLOD OVERALT</p>
            <button id="startstream"onClick = {start}>START</button>
            </div>
        </div>
    )

};

export default Home;
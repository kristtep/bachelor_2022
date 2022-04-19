import "../styles.css";
import { Link } from "react-router-dom";

const Home = () => {

    

    return (
        <div id="home" >
            <div id="welcome">
                <p>Velkommen til PreViS Samhandlingssystem, et video overføringsystem for ambulanser og sykehus</p>
            </div>
            <div id="start">
                <Link to="hospital">
                    <h2>Sykehus</h2>
                </Link>
                
            </div>

            <div id="start">
                <Link to="ambulance">
                    <h2>Ambulanse</h2>
                </Link>
                
            </div>
        </div>
    )

};

export default Home;
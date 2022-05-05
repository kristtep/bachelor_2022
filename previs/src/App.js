import './App.css';
import Ambulance from "./components/Ambulance";
import Hospital from "./components/Hospital";
import Home from "./components/Home";
import Div100vh from "react-div-100vh";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {

  return (
    <Div100vh>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
            </Route>
            <Route path="/hospital" element={<Hospital />}>
            </Route>
            <Route path="/ambulance" element={<Ambulance />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Div100vh>
  )
}

export default App;
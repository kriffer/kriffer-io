import React from 'react';

import Main from "./layout";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "./pages/login";
import Register from "./pages/register";


const App: React.FC = () => {
    console.log({REACT_APP_API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT})
    return (
        <div className="App">

            <BrowserRouter>



                    <Main/>

            </BrowserRouter>
        </div>
    );
}

export default App;

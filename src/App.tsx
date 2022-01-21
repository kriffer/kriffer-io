import React from 'react';

import Main from "./layout";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "./pages/login";
import Register from "./pages/register";


const App: React.FC = () => {
      return (
        <div className="App">

            <BrowserRouter>



                    <Main/>

            </BrowserRouter>
        </div>
    );
}

export default App;

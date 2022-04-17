import React from 'react';

import Main from "./layout";
import {BrowserRouter} from "react-router-dom";



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

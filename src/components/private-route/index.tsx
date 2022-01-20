import React from 'react';
import {Navigate} from 'react-router-dom';

type PrivateRouteProps = {
    children: any
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {

    const token = localStorage.getItem('token');

    return token ? children : <Navigate to="/login"/>;
};

export default PrivateRoute;
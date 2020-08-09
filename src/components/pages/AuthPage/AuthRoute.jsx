import React from 'reactn';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, authed, ...rest }) => {
    return(
        <Route
            render={(props) => authed? <Component {...rest} /> : <Redirect to='/auth' /> } />
    )
}

export default AuthRoute;
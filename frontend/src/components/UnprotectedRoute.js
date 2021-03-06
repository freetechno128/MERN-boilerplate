import React, { useContext } from "react"
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../contexts/AuthContext"

function UnprotectedRoute(props) {

    const { token } = useContext(AuthContext);
    const { component: Component, ...rest } = props;

    return (
        !token ?
            <Route {...rest} component={Component} /> :
            <Redirect to="/protected" />
    )
}

export default UnprotectedRoute;
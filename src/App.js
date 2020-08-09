import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// PAGES
import AuthRoute from './components/pages/AuthPage/AuthRoute';
import AuthPage from './components/pages/AuthPage/AuthPage';
import HomePage from './components/pages/HomePage/HomePage';

// axios.defaults.baseURL = "https://us-central1-freelance-fa244.cloudfunctions.net/api";
// axios.defaults.baseURL = "http://localhost:5001/freelance-fa244/us-central1/api";

// Auth 
const token = localStorage.token;
axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
let authed, dToken;
if(token){
    dToken = jwtDecode(token);
    if (dToken.exp*1000 < Date.now()){
        authed = false;
        localStorage.clear()
        window.location.href='/auth';
    } else {
        authed = true;
    }
} else {
    console.log("Not authed")
}

function App() {
	return (
		<Router>
			<Switch>

				<AuthRoute exact path="/" component={HomePage} token={dToken} authed={authed}/>
				<Route exact path="/auth" component={AuthPage} authed={authed}/>

			</Switch>
		</Router>
	);
}

export default App;

import React from 'reactn';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';

// PAGES
import AuthPage from './components/pages/AuthPage/AuthPage';
import HomePage from './components/pages/HomePage/HomePage';


function App() {
	return (
		<Router>
			<Switch>

				<Route exact path="/" component={HomePage}/>

				<Route exact path="/auth" component={AuthPage}/>

			</Switch>
		</Router>
	);
}

export default App;

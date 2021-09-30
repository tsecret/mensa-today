import React from 'react';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";

import { Home, Auth, Dashboard, Profile } from './pages';

const App = () => (
	<Router>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/auth" component={Auth} />
			<Route exact path="/dashboard" component={Dashboard} />
			<Route exact path="/user/:id" component={Profile} />
        </Switch>
	</Router>
)

export default App;

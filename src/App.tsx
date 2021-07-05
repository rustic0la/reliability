import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Editor from './components/Editor';
import StartPage from './components/StartPage';
import './App.css';

const App = () => (
	<Router>
		<Switch>
			<Route path="/" exact component={StartPage} />
			<Route path="/mxgraph" exact component={Editor} />
		</Switch>
	</Router>
);

export default App;

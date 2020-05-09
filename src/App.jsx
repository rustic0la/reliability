import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ConditionsFormContent from './components/ConditionsFormContent';
import Editor from './components/Editor';
import StartPage from './components/StartPage';
import './App.css';

const App = () => (
	<Router>
		<Switch>
			<Route path="/" exact component={StartPage} />
			<Route path="/calculator" exact component={ConditionsFormContent} />
			<Route path="/mxgraph" exact component={Editor} />
			<Route path="/results" />
		</Switch>
	</Router>
);

export default App;

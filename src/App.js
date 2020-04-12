import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Calculator from './components/math/Calc';
import Editor from './components/graphEditor/Editor';
import Menu from './components/Menu';
import './App.css';

const App = () => (
	<Router>
		<Switch>
			<Route path="/" exact component={Menu} />
			<Route path="/calculator" exact component={Calculator} />
			<Route path="/mxgraph" exact component={Editor} />
			<Route path="/results" />
		</Switch>
	</Router>
);

export default App;

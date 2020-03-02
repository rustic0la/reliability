import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
	return (
		<div className="App">
			<header className="App-header">Расчетный модуль надежности</header>
			<main>
				<Link to={'/mxgraph'}>New Schema</Link>
			</main>
		</div>
	);
}

export default Menu;

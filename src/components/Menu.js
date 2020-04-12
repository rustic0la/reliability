import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Menu() {
	const handleClick = () => {
		localStorage.clear();
	};

	return (
		<div className="App">
			<header className="App-header">Расчетный модуль надежности</header>
			<main>
				<Link to={'/mxgraph'} onClick={handleClick}>
					<Button
						variant="success"
						style={{
							fontSize: '14px',
							padding: '10px 10px',
							margin: '20px 120px',
							width: '50%',
						}}
					>
						New Schema
					</Button>
				</Link>
			</main>
		</div>
	);
}

export default Menu;

import React from 'react';

import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Graph from './Graph';
import ModalWin from './Modal';

const Editor = () => (
	<>
		<Graph />
		<Link to={'/'} style={{ position: 'absolute', top: '3px', left: '5px' }}>
			<Button
				variant="warning"
				onClick={() =>
					(document.getElementById('close-btn').style.visivility = 'visible')
				}
				style={{ fontSize: '14px', padding: '3px 6px' }}
			>
				Меню
			</Button>
		</Link>
		<ModalWin />
	</>
);

export default Editor;

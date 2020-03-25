import React, { useState, useEffect } from 'react';
import {
	mxGraph,
	mxConstants,
	mxOutline,
	mxToolbar,
	mxRubberband,
	mxHierarchicalLayout,
} from 'mxgraph-js';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import {
	renderJSON,
	getJsonModel,
	stringifyWithoutCircular,
} from './jsonCodec';
import './style.css';
import executeLayout from './layout';
import setBaseConfig from './setBaseConfig';

//TODO folding = container
//TODO list of components ADD CUSTOMS

const Editor = () => {
	const [container] = useState(document.createElement('div'));
	const [tbContainer] = useState(document.createElement('div'));
	const [sbContainer] = useState(document.createElement('div'));
	const [outlnContainer] = useState(document.createElement('div'));
	const [graph] = useState(new mxGraph(container));
	const [sidebar] = useState(new mxToolbar(sbContainer));

	useEffect(() => {
		loadGraph(graph, container, tbContainer, sbContainer, outlnContainer);
	});

	const loadGraph = (
		graph,
		container,
		tbContainer,
		sbContainer,
		outlineContainer,
	) => {
		container.className = 'container';
		document.getElementById('graphContainer').appendChild(container);

		tbContainer.className = 'tbContainer';
		document.getElementById('graphContainer').appendChild(tbContainer);

		sbContainer.className = 'sbContainer';
		document.getElementById('graphContainer').appendChild(sbContainer);

		outlineContainer.className = 'outlineContainer';
		document.getElementById('graphContainer').appendChild(outlineContainer);

		const layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);

		setBaseConfig(graph, tbContainer, sidebar, layout);

		new mxOutline(graph, outlineContainer);
		new mxRubberband(graph);

		if (localStorage.getItem('json') !== '') {
			renderJSON(JSON.parse(localStorage.getItem('json')), graph);
			executeLayout(graph, layout);
		}
	};

	// TODO check values

	const handleCalc = () => {
		const jsonNodes = getJsonModel(graph);
		let jsonStr = stringifyWithoutCircular(jsonNodes);
		localStorage.setItem('json', jsonStr);
		document.getElementById('close-btn').style.visibility = 'hidden';
	};

	const handleMenu = () => {
		document.getElementById('close-btn').style.visibility = 'visible';
	};

	return (
		<>
			<div id="graphContainer" />

			<Link to={'/'} style={{ position: 'absolute', top: '3px', left: '5px' }}>
				<Button
					variant="warning"
					style={{ fontSize: '14px', padding: '3px 6px' }}
					onClick={handleMenu}
				>
					Меню
				</Button>
			</Link>

			<Link
				to={'/calculator'}
				style={{ position: 'absolute', top: '3px', right: '15px' }}
				onClick={handleCalc}
			>
				<Button variant="warning" style={{ fontSize: '14px', padding: '3px' }}>
					Рассчитать
				</Button>
			</Link>
		</>
	);
};

export default Editor;

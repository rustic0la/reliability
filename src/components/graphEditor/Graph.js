import React, { useState, useEffect } from 'react';
import {
	mxGraph,
	mxConstants,
	mxOutline,
	mxToolbar,
	mxRubberband,
	mxHierarchicalLayout,
} from 'mxgraph-js';

import './style.css';
import setGraphConfig from './graphSetUp/setGraphConfig';

//TODO folding = container
// TODO style for k_of_n edges
// TODO validate input values
//TODO list of components ADD CUSTOMS

const Graph = () => {
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

		setGraphConfig(graph, tbContainer, sidebar, layout);

		new mxOutline(graph, outlineContainer);
		new mxRubberband(graph);
	};

	return <div id="graphContainer" />;
};

export default Graph;

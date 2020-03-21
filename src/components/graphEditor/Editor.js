import React, { useState, useEffect } from 'react';
import {
	mxGraph,
	mxConstants,
	mxOutline,
	mxEvent,
	mxToolbar,
	mxUndoManager,
	mxRubberband,
	mxHierarchicalLayout,
	mxEdgeHandler,
} from 'mxgraph-js';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import undo from '../../assets/images/undo.png';
import redo from '../../assets/images/redo.png';
import zoom_in from '../../assets/images/zoomin.png';
import zoom_out from '../../assets/images/zoomout.png';
import del from '../../assets/images/delete.png';
import actual from '../../assets/images/actual.png';
import rectangle from '../../assets/images/rectangle.png';
import output from '../../assets/images/output.png';
import mOfn from '../../assets/images/mofn.png';
import input from '../../assets/images/input.png';
import loaded from '../../assets/images/loaded.png';
import joint from '../../assets/images/joint.png';

import {
	setDefaultCellsStyle,
	setVertexStyles,
	setGraphStyle,
} from './setStyles';
import addVertex from './addVertex';
import addToolbarButton from './addToolbar';
import {
	renderJSON,
	getJsonModel,
	stringifyWithoutCircular,
} from './jsonCodec';
import './style.css';

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

	//////////////////////////////// TOOLBAR BUTTONS & HANDLERS

	const loadGraph = (
		graph,
		container,
		tbContainer,
		sbContainer,
		outlineContainer,
	) => {
		//////////////////////// CREATE DIVS
		container.className = 'container';
		document.getElementById('graphContainer').appendChild(container);

		tbContainer.className = 'tbContainer';
		document.getElementById('graphContainer').appendChild(tbContainer);

		sbContainer.className = 'sbContainer';
		document.getElementById('graphContainer').appendChild(sbContainer);

		outlineContainer.className = 'outlineContainer';
		document.getElementById('graphContainer').appendChild(outlineContainer);

		////////////////////// GRAPH EDITOR STYLES
		const undoManager = new mxUndoManager();
		const listener = function(sender, evt) {
			undoManager.undoableEditHappened(evt.getProperty('edit'));
		};
		graph.getModel().addListener(mxEvent.UNDO, listener);
		graph.getView().addListener(mxEvent.UNDO, listener);

		setGraphStyle(graph, undoManager);
		new mxOutline(graph, outlineContainer);
		new mxRubberband(graph);

		//////////////////////////// TOOLBAR
		addToolbarButton(null, graph, tbContainer, 'delete', del);
		addToolbarButton(null, graph, tbContainer, 'zoomIn', zoom_in);
		addToolbarButton(null, graph, tbContainer, 'zoomOut', zoom_out);
		addToolbarButton(null, graph, tbContainer, 'zoomActual', actual);
		addToolbarButton(undoManager, graph, tbContainer, 'undo', undo);
		addToolbarButton(undoManager, graph, tbContainer, 'redo', redo);

		setDefaultCellsStyle(graph);
		setVertexStyles(graph);

		addVertex(graph, sidebar, rectangle, 60, 42, 'rectangle', 'rectangle');
		addVertex(graph, sidebar, joint, 10, 10, 'joint', 'joint');
		addVertex(graph, sidebar, mOfn, 45, 45, 'mOfn', 'mOfn');
		addVertex(graph, sidebar, input, 35, 35, 'input');
		addVertex(graph, sidebar, output, 35, 35, 'output');
		addVertex(graph, sidebar, loaded, 80, 56, 'loaded', 'loaded');

		mxConstants.ENTITY_SEGMENT = 25;

		const layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
		mxHierarchicalLayout.prototype.resizeParent = true;
		mxHierarchicalLayout.prototype.marginBottom = 10;
		mxHierarchicalLayout.prototype.marginTop = 10;
		mxHierarchicalLayout.prototype.maintainParentLocation = true;
		mxHierarchicalLayout.prototype.moveParent = true;
		mxHierarchicalLayout.prototype.parentBorder = 0;
		mxHierarchicalLayout.prototype.intraCellSpacing = 10;
		mxHierarchicalLayout.prototype.interRankCellSpacing = 50;
		mxHierarchicalLayout.prototype.interHierarchySpacing = 50;
		mxHierarchicalLayout.prototype.parallelEdgeSpacing = 20;
		mxHierarchicalLayout.prototype.orientation = 'north';
		mxHierarchicalLayout.prototype.fineTuning = false;
		mxHierarchicalLayout.prototype.tightenToSource = false;
		mxHierarchicalLayout.prototype.disableEdgeStyle = false;
		mxHierarchicalLayout.prototype.edgeStyle = 2;
		mxHierarchicalLayout.prototype.traverseAncestors = false;

		var executeLayout = function(change, post) {
			graph.getModel().beginUpdate();
			try {
				layout.execute(graph.getDefaultParent());
			} catch (e) {
				throw e;
			} finally {
				graph.getModel().endUpdate();
			}
		};

		const edgeHandleConnect = mxEdgeHandler.prototype.connect;
		mxEdgeHandler.prototype.connect = function(
			edge,
			terminal,
			isSource,
			isClone,
			me,
		) {
			edgeHandleConnect.apply(this, arguments);
			executeLayout();
		};

		graph.resizeCell = function() {
			mxGraph.prototype.resizeCell.apply(this, arguments);
			executeLayout();
		};

		graph.connectionHandler.addListener(mxEvent.CONNECT, function() {
			executeLayout();
		});

		if (localStorage.getItem('json') !== '') {
			setDefaultCellsStyle(graph);
			renderJSON(JSON.parse(localStorage.getItem('json')), graph, layout);
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

import React, { useState, useEffect } from 'react';
import undo from '../../assets/images/undo.png';
import redo from '../../assets/images/redo.png';
import zoom_in from '../../assets/images/zoomin.png';
import zoom_out from '../../assets/images/zoomout.png';
import input from '../../assets/images/input.png';
import inp from '../../assets/images/inp.png';
import outp from '../../assets/images/outp.png';
import output from '../../assets/images/output.png';
import mOfn from '../../assets/images/mofn.png';
import loaded from '../../assets/images/loaded.png';
import rectangle from '../../assets/images/rectangle.png';
import del from '../../assets/images/delete.png';
import plus from '../../assets/images/plus.png';
import actual from '../../assets/images/actual.png';
import mOfnEmpty from '../../assets/images/mOfnEmpty.png';
import './style.css';

import {
	mxGraph,
	mxGraphHandler,
	mxConstants,
	mxOutline,
	mxEdgeStyle,
	mxCell,
	mxGeometry,
	mxGraphModel,
	mxClient,
	mxUtils,
	mxEvent,
	mxObjectCodec,
	mxKeyHandler,
	mxToolbar,
	mxConnectionConstraint,
	mxPoint,
	mxEditor,
	mxUndoManager,
	mxRubberband,
	mxCellOverlay,
	mxImage,
	mxHierarchicalLayout,
	mxMorphing,
	mxEdgeHandler,
	mxPerimeter,
	mxStackLayout,
	mxLayoutManager,
	mxCellRenderer,
	mxEventObject,
} from 'mxgraph-js';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

//TODO: autolayout = same blocks
//TODO implement flow cycle from beginning to end JSON SAVE AND LOAD
//TODO folding = container
//TODO list of components ADD CUSTOMS

class JsonCodec extends mxObjectCodec {
	constructor() {
		super(value => {});
	}
	decode(model) {
		return Object.keys(model.cells)
			.map(iCell => {
				const currentCell = model.getCell(iCell);
				return currentCell.value !== undefined ? currentCell : null;
			})
			.filter(item => item !== null);
	}
}

const Editor = () => {
	const [container] = useState(document.createElement('div'));
	const [tbContainer] = useState(document.createElement('div'));
	const [sbContainer] = useState(document.createElement('div'));
	const [outlnContainer] = useState(document.createElement('div'));
	const [graph] = useState(new mxGraph(container));
	const [sidebar] = useState(new mxToolbar(sbContainer));

	useEffect(() => {
		loadGraph(graph, container, tbContainer, sbContainer, outlnContainer);
	}, []);

	const setStyle = (graph, undoManager) => {
		graph.setConnectable(true);
		graph.setCellsEditable(true);
		graph.setEnabled(true);
		///graph.dropEnabled = true;
		graph.centerZoom = true;
		//graph.autoSizeCellsOnAdd = true;
		//graph.setDisconnectOnMove(false);
		//graph.setCellsDisconnectable(false);
		//graph.setCellsCloneable(false);
		graph.setAllowDanglingEdges(false);
		//mxEvent.disableContextMenu(container);
		/*

		graph.getAllConnectionConstraints = function(terminal) {
			if (terminal != null && this.model.isVertex(terminal.cell)) {
				return [
					new mxConnectionConstraint(new mxPoint(0.5, 0), true),
					new mxConnectionConstraint(new mxPoint(0, 0.5), true),
					new mxConnectionConstraint(new mxPoint(1, 0.5), true),
					new mxConnectionConstraint(new mxPoint(0.5, 1), true),
				];
			}
			return null;
		};*/

		const keyHandler = new mxKeyHandler(graph);
		keyHandler.bindKey(46, function(evt) {
			if (graph.isEnabled()) {
				graph.removeCells();
			}
		});

		keyHandler.bindControlKey(65, function(evt) {
			if (graph.isEnabled()) {
				graph.selectAll();
			}
		});

		keyHandler.bindControlKey(90, function(evt) {
			if (graph.isEnabled()) {
				undoManager.undo();
			}
		});

		keyHandler.bindControlKey(89, function(evt) {
			if (graph.isEnabled()) {
				undoManager.redo();
			}
		});

		mxGraphHandler.prototype.guidesEnabled = true;
	};

	const addSidebarIcon = (
		graph,
		sidebar,
		prototype,
		image,
		imgStyle = 'rectangle',
	) => {
		const funct = (graph, evt, cell, x, y) => {
			graph.stopEditing(false);

			const vertex = graph.getModel().cloneCell(prototype);
			vertex.geometry.x = x;
			vertex.geometry.y = y;

			graph.addCell(vertex);
			graph.setSelectionCell(vertex);
		};

		const img = sidebar.addMode(
			null,
			image,
			(evt, cell) => {
				const pt = this.graph.getPointForEvent(evt);
				funct(graph, evt, cell, pt.x, pt.y);
			},
			image,
			`${imgStyle}`,
		);
		// This listener is always called first before any other listener
		// in all browsers.
		mxEvent.addListener(img, 'mousedown', evt => {
			if (img.enabled == false) {
				mxEvent.consume(evt);
			}
		});

		mxUtils.makeDraggable(img, graph, funct);

		return img;
	};

	const addVertex = (icon, w, h, style, imgStyle) => {
		const vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
		vertex.setVertex(true);

		const img = addSidebarIcon(graph, sidebar, vertex, icon, imgStyle);
		img.enabled = true;

		graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
			const tmp = graph.isSelectionEmpty();
			img.enabled = tmp;
		});
	};

	//////////////////////////////// WRITE JSON

	const getJsonModel = graph => {
		const encoder = new JsonCodec();
		const jsonModel = encoder.decode(graph.getModel());
		return {
			graph: jsonModel,
		};
	};

	const stringifyWithoutCircular = json => {
		return JSON.stringify(
			json,
			(key, value) => {
				if (
					(key === 'parent' || key === 'source' || key === 'target') &&
					value !== null
				) {
					return value.id;
				} else if (key === 'value' && value !== null && value.localName) {
					let results = {};
					Object.keys(value.attributes).forEach(attrKey => {
						const attribute = value.attributes[attrKey];

						results[attribute.nodeName] = attribute.nodeValue;
					});
					return results;
				}
				return value;
			},
			4,
		);
	};

	//////////////////////////////// RENDER JSON

	const renderJSON = (dataModel, graph) => {
		let vertices = {};
		const parent = graph.getDefaultParent();
		graph.getModel().beginUpdate(); // Adds cells to the model in a single step
		try {
			dataModel &&
				dataModel.graph.map(node => {
					if (node.vertex) {
						vertices[node.id] = graph.insertVertex(
							parent,
							null,
							node.value,
							node.geometry.x,
							node.geometry.y,
							node.geometry.width,
							node.geometry.height,
							node.style,
						);
					} else if (node.edge) {
						graph.insertEdge(
							parent,
							null,
							null,
							vertices[node.source],
							vertices[node.target],
							node.style,
						);
					}
				});
		} finally {
			graph.getModel().endUpdate();
		}
	};

	//////////////////////////////// TOOLBAR BUTTONS & HANDLERS

	const addToolbarButton = (
		undoManager,
		graph,
		toolbar,
		action,
		image,
		label = '',
	) => {
		const button = document.createElement('button');
		button.style.fontSize = '10';
		button.style.marginRight = '5px';
		if (image != null) {
			const img = document.createElement('img');
			img.setAttribute('src', image);
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.verticalAlign = 'middle';
			img.style.marginRight = '2px';
			button.appendChild(img);
		}
		mxEvent.addListener(button, 'click', function() {
			switch (action) {
				case 'delete':
					graph.removeCells();
					break;
				case 'zoomIn':
					graph.zoomIn();
					break;
				case 'zoomOut':
					graph.zoomOut();
					break;
				case 'zoomActual':
					graph.zoomActual();
					break;
				case 'undo':
					undoManager.undo();
					break;
				case 'redo':
					undoManager.redo();
					break;
				default:
					break;
			}
		});
		mxUtils.write(button, label);
		toolbar.appendChild(button);
	};

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
		//////////////////////////////////////////

		////////////////////// GRAPH EDITOR STYLES
		const undoManager = new mxUndoManager();
		const listener = function(sender, evt) {
			undoManager.undoableEditHappened(evt.getProperty('edit'));
		};
		graph.getModel().addListener(mxEvent.UNDO, listener);
		graph.getView().addListener(mxEvent.UNDO, listener);

		setStyle(graph, undoManager);
		new mxOutline(graph, outlineContainer);
		new mxRubberband(graph);
		////////////////////////////////////////////

		//////////////////////////// TOOLBAR
		addToolbarButton(undoManager, graph, tbContainer, 'delete', del);
		addToolbarButton(undoManager, graph, tbContainer, 'zoomIn', zoom_in);
		addToolbarButton(undoManager, graph, tbContainer, 'zoomOut', zoom_out);
		addToolbarButton(undoManager, graph, tbContainer, 'zoomActual', actual);
		addToolbarButton(undoManager, graph, tbContainer, 'undo', undo);
		addToolbarButton(undoManager, graph, tbContainer, 'redo', redo);

		//////////////////////////// EDGES STYLE
		const edgeStyle = {};
		edgeStyle[mxConstants.STYLE_STROKECOLOR] = '#000';
		edgeStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
		edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
		edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
		edgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
		edgeStyle[mxConstants.STYLE_FONTSIZE] = '16';
		edgeStyle[mxConstants.VALID_COLOR] = '#000';
		graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

		//////////////////////////// VERTEX STYLES
		const defaultStyle = {};
		defaultStyle[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_RECTANGLE;
		defaultStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
		defaultStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
		defaultStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
		defaultStyle[mxConstants.STYLE_FONTSIZE] = '16';
		defaultStyle[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
		defaultStyle[mxConstants.STYLE_FONTCOLOR] = '#000';
		defaultStyle[mxConstants.STYLE_FONTSTYLE] = 0;
		defaultStyle[mxConstants.STYLE_SPACING_LEFT] = '4';
		defaultStyle[mxConstants.HANDLE_FILLCOLOR] = '#80c6ee';
		defaultStyle[mxConstants.STYLE_IMAGE_WIDTH] = '48';
		defaultStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
		graph.getStylesheet().putDefaultVertexStyle(defaultStyle);

		//////////////////////////// VERTEX & SIDEBAR
		const rectangleStyle = {};
		rectangleStyle[mxConstants.STYLE_IMAGE] = rectangle;
		graph.getStylesheet().putCellStyle('rectangle', rectangleStyle);
		addVertex(rectangle, 70, 52, 'rectangle', 'rectangle');

		const mOfNStyle = {};
		mOfNStyle[mxConstants.STYLE_IMAGE] = mOfnEmpty;
		graph.getStylesheet().putCellStyle('mOfn', mOfNStyle);
		addVertex(mOfn, 45, 45, 'mOfn', 'mOfn');

		const inputStyle = {};
		inputStyle[mxConstants.STYLE_IMAGE] = inp;
		inputStyle[mxConstants.STYLE_EDITABLE] = 0;
		graph.getStylesheet().putCellStyle('input', inputStyle);
		addVertex(input, 35, 35, 'input');

		const outputStyle = {};
		outputStyle[mxConstants.STYLE_IMAGE] = outp;
		outputStyle[mxConstants.STYLE_EDITABLE] = 0;
		graph.getStylesheet().putCellStyle('output', outputStyle);
		addVertex(output, 35, 35, 'output');

		const loadedStyle = {};
		loadedStyle[mxConstants.STYLE_IMAGE] = loaded;
		loadedStyle[mxConstants.STYLE_FONTSIZE] = '13';
		graph.getStylesheet().putCellStyle('loaded', loadedStyle);
		addVertex(loaded, 80, 56, 'loaded', 'loaded');
		////////////////////////////////////////////////

		if (localStorage.getItem('json') !== '') {
			renderJSON(JSON.parse(localStorage.getItem('json')), graph);
		}
	};

	// TODO check values
	/*
			mxCell.prototype.setValue = input => {
				console.log(input);
				if (parseInt(input) && parseInt(input) >= 0 && parseInt(input) <= 1) {
					console.log('checked');
				}
			};*/

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

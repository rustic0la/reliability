import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import undo from '../../assets/images/undo.png';
import redo from '../../assets/images/redo.png';
import zoom_in from '../../assets/images/zoomin.png';
import zoom_out from '../../assets/images/zoomout.png';
import input from '../../assets/images/input.png';
import output from '../../assets/images/output.png';
import mOfn from '../../assets/images/mofn.png';
import loaded from '../../assets/images/loaded.png';
import rectangle from '../../assets/images/rectangle.png';
import del from '../../assets/images/delete.png';
import copy from '../../assets/images/copy.png';
import paste from '../../assets/images/paste.png';
import grid from '../../assets/images/grid.png';
import plus from '../../assets/images/plus.png';
import actual from '../../assets/images/actual.png';
import './style.css';

import {
	mxGraph,
	mxConstants,
	mxOutline,
	mxEditor,
	mxEdgeStyle,
	mxCell,
	mxGeometry,
	mxGraphModel,
	mxClient,
	mxWindow,
	mxUtils,
	mxImage,
	mxRectangle,
	mxEvent,
	mxEffects,
	mxObjectCodec,
	mxConnectionHandler,
	mxPerimeter,
	mxDivResizer,
	mxKeyHandler,
	mxRubberband,
	mxToolbar,
	mxGraphHandler,
	mxConnectionConstraint,
	mxPoint,
	mxEdgeHandler,
	mxDefaultKeyHandler,
} from 'mxgraph-js';

//TODO: outline dragging
//TODO: toolbar buttons and blocks of components

//TODO: autolayout

//TODO folding
//TODO scrolling
//TODO labels values
//TODO list of components

class JsonCodec extends mxObjectCodec {
	constructor() {
		super(value => {});
	}
	encode(value) {
		const xmlDoc = mxUtils.createXmlDocument();
		const newObject = xmlDoc.createElement('TaskObject');
		for (let prop in value) {
			newObject.setAttribute(prop, value[prop]);
		}
		return newObject;
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

class Editor extends Component {
	constructor(props) {
		super(props);
		this.loadGraph = this.loadGraph.bind(this);
	}

	componentDidMount() {
		this.loadGraph();
	}

	loadGraph() {
		// Checks if browser is supported
		if (!mxClient.isBrowserSupported()) {
			// Displays an error message if the browser is
			// not supported.
			mxUtils.error('Browser is not supported!', 200, false);
		} else {
			mxGraphHandler.prototype.guidesEnabled = true;

			const tbContainer = document.createElement('div');
			tbContainer.style.position = 'absolute';
			tbContainer.style.whiteSpace = 'nowrap';
			tbContainer.style.overflow = 'hidden';
			tbContainer.style.top = '0px';
			tbContainer.style.left = '0px';
			tbContainer.style.maxHeight = '24px';
			tbContainer.style.height = '36px';
			tbContainer.style.right = '0px';
			tbContainer.style.padding = '6px';
			tbContainer.style.background = 'yellow';
			document.getElementById('graphContainer').appendChild(tbContainer);

			const toolbar = new mxToolbar(tbContainer);
			toolbar.enabled = false;

			const sbContainer = document.createElement('div');
			sbContainer.style.position = 'absolute';
			sbContainer.style.overflow = 'hidden';
			sbContainer.style.top = '36px';
			sbContainer.style.left = '0px';
			sbContainer.style.bottom = '0px';
			sbContainer.style.maxWidth = '52px';
			sbContainer.style.width = '56px';
			sbContainer.style.paddingTop = '10px';
			sbContainer.style.paddingLeft = '4px';
			sbContainer.style.background = 'orange';
			document.getElementById('graphContainer').appendChild(sbContainer);

			const sidebar = new mxToolbar(sbContainer);
			sidebar.enabled = false;

			const container = document.createElement('div');
			container.style.position = 'absolute';
			container.style.overflow = 'hidden';
			container.style.top = '36px';
			container.style.left = '56px';
			container.style.bottom = '0px';
			container.style.right = '0px';
			container.style.background = `url(${grid})`;
			document.getElementById('graphContainer').appendChild(container);

			const outlineContainer = document.createElement('div');
			outlineContainer.style.position = 'absolute';
			outlineContainer.style.overflow = 'hidden';
			outlineContainer.style.top = '36px';
			outlineContainer.style.right = '0px';
			outlineContainer.style.width = '200px';
			outlineContainer.style.height = '140px';
			outlineContainer.style.background = 'transparent';
			outlineContainer.style.border = 'solid black';
			document.getElementById('graphContainer').appendChild(outlineContainer);

			// Creates the model and the graph inside the container
			// using the fastest rendering available on the browser
			const model = new mxGraphModel();
			const graph = new mxGraph(container, model);
			new mxOutline(graph, outlineContainer);

			//keyhandling:
			//const keyHandler = new mxDefaultKeyHandler(graph);
			//keyHandler.bindAction(46, 'delete');

			new mxKeyHandler(graph);
			new mxRubberband(graph);

			const addToolbarButton = (editor, toolbar, action, label, image) => {
				const button = document.createElement('button');
				button.style.fontSize = '10';
				if (image != null) {
					const img = document.createElement('img');
					img.setAttribute('src', image);
					img.style.width = '16px';
					img.style.height = '16px';
					img.style.verticalAlign = 'middle';
					img.style.marginRight = '2px';
					button.appendChild(img);
				}
				mxEvent.addListener(button, 'click', evt => {
					editor.execute(action);
				});
				mxUtils.write(button, label);
				//toolbar.appendChild(button);
			};

			//addToolbarButton(graph, toolbar, 'delete', '', del);

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
				// Disables dragging if element is disabled. This is a workaround
				// for wrong event order in IE. Following is a dummy listener that
				// is invoked as the last listener in IE.
				mxEvent.addListener(img, 'mousedown', evt => {
					// do nothing
				});

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

			const setStyles = graph => {
				const rectangleStyle = {};
				rectangleStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				rectangleStyle[mxConstants.STYLE_IMAGE] = rectangle;
				graph.getStylesheet().putCellStyle('rectangle', rectangleStyle);
				addVertex(rectangle, 70, 70, 'rectangle', 'rectangle');

				const mOfNStyle = {};
				mOfNStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				mOfNStyle[mxConstants.STYLE_IMAGE] = mOfn;
				graph.getStylesheet().putCellStyle('mOfn', mOfNStyle);
				addVertex(mOfn, 50, 50, 'mOfn', 'mOfn');

				const inputStyle = {};
				inputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				inputStyle[mxConstants.STYLE_IMAGE] = input;
				graph.getStylesheet().putCellStyle('input', inputStyle);
				addVertex(input, 40, 40, 'input');

				const outputStyle = {};
				outputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				outputStyle[mxConstants.STYLE_IMAGE] = output;
				graph.getStylesheet().putCellStyle('output', outputStyle);
				addVertex(output, 40, 40, 'output');

				const loadedStyle = {};
				loadedStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
				loadedStyle[mxConstants.STYLE_IMAGE] = loaded;
				graph.getStylesheet().putCellStyle('loaded', loadedStyle);
				addVertex(loaded, 80, 80, 'loaded', 'loaded');
			};

			setStyles(graph);
		}
	}

	render() {
		return <div id="graphContainer" />;
	}
}

export default Editor;

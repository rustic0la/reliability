import React, { Component } from 'react';
import undo from '../../assets/images/undo.png';
import grid from '../../assets/images/grid.png';
import redo from '../../assets/images/redo.png';
import zoom_in from '../../assets/images/zoomin.png';
import zoom_out from '../../assets/images/zoomout.png';
import input from '../../assets/images/input.png';
import circle from '../../assets/images/circle.png';
import output from '../../assets/images/output.png';
import mOfn from '../../assets/images/mofn.png';
import loaded from '../../assets/images/loaded.png';
import rectangle from '../../assets/images/rectangle.png';
import del from '../../assets/images/delete.png';
import copy from '../../assets/images/copy.png';
import paste from '../../assets/images/paste.png';
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
	mxRubberband,
	mxToolbar,
	mxConnectionConstraint,
	mxPoint,
	mxDefaultKeyHandler,
	mxEditor,
} from 'mxgraph-js';
import { Link } from 'react-router-dom';

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
	componentDidMount = () => {
		this.loadGraph();
	};

	loadGraph = () => {
		if (!mxClient.isBrowserSupported()) {
			mxUtils.error('Browser is not supported!', 200, false);
		} else {
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

			const sidebar = new mxToolbar(sbContainer);
			const model = new mxGraphModel();
			const graph = new mxGraph(container, model);

			var editor = new mxEditor();

			new mxOutline(graph, outlineContainer);
			const keyHandler = new mxDefaultKeyHandler(editor);
			keyHandler.bindAction(46, 'delete');
			//const keyHandler = new mxDefaultKeyHandler(graph);
			//new mxKeyHandler(graph);
			//new mxRubberband(graph);

			mxGraphHandler.prototype.guidesEnabled = true;

			const style = {};
			style[mxConstants.STYLE_STROKECOLOR] = '#000';
			style[mxConstants.STYLE_STROKEWIDTH] = '2';
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
			style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
			style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
			graph.getStylesheet().putDefaultEdgeStyle(style);

			graph.setPanning(true);
			graph.setConnectable(true);
			graph.setCellsEditable(true);
			graph.setEnabled(true);
			graph.setHtmlLabels(true);
			graph.centerZoom = true;
			graph.autoSizeCellsOnAdd = true;

			graph.getAllConnectionConstraints = function(terminal) {
				if (terminal != null && this.model.isVertex(terminal.cell)) {
					return [
						new mxConnectionConstraint(new mxPoint(0.5, 0), true),
						new mxConnectionConstraint(new mxPoint(0, 0.5), true),
						new mxConnectionConstraint(new mxPoint(1, 0.5), true),
						new mxConnectionConstraint(new mxPoint(0.5, 1), true),
						new mxConnectionConstraint(new mxPoint(0, 1), true),
						new mxConnectionConstraint(new mxPoint(1, 0), true),
						new mxConnectionConstraint(new mxPoint(0, 0), true),
						new mxConnectionConstraint(new mxPoint(1, 1), true),
					];
				}
				return null;
			};

			graph.insertVertex(
				graph.getDefaultParent(),
				null,
				'World!',
				200,
				150,
				80,
				30,
			);

			const addToolbarButton = (editor, toolbar, action, label, image) => {
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
				mxEvent.addListener(button, 'click', function(evt) {
					editor.execute(action);
				});
				mxUtils.write(button, label);
				toolbar.appendChild(button);
			};

			addToolbarButton(graph, tbContainer, 'delete', '', del);
			addToolbarButton(graph, tbContainer, 'copy', '', copy);
			addToolbarButton(graph, tbContainer, 'paste', '', paste);
			addToolbarButton(graph, tbContainer, 'zoomIn', '', zoom_in);
			addToolbarButton(graph, tbContainer, 'zoomOut', '', zoom_out);
			addToolbarButton(graph, tbContainer, 'restore', '', actual);
			addToolbarButton(graph, tbContainer, 'undo', '', undo);
			addToolbarButton(graph, tbContainer, 'redo', '', redo);

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

			const rectangleStyle = {};
			rectangleStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
			rectangleStyle[mxConstants.STYLE_IMAGE] = rectangle;
			rectangleStyle[mxConstants.STYLE_PERIMETER] =
				mxConstants.PERIMETER_RECTANGLE;
			graph.getStylesheet().putCellStyle('rectangle', rectangleStyle);
			addVertex(rectangle, 70, 52, 'rectangle', 'rectangle');

			const mOfNStyle = {};
			mOfNStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
			mOfNStyle[mxConstants.STYLE_IMAGE] = mOfnEmpty;
			mOfNStyle[mxConstants.STYLE_PERIMETER] = mxConstants.PERIMETER_ELLIPSE;
			graph.getStylesheet().putCellStyle('mOfn', mOfNStyle);
			addVertex(mOfn, 50, 50, 'mOfn', 'mOfn');

			const inputStyle = {};
			inputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
			inputStyle[mxConstants.STYLE_IMAGE] = circle;
			graph.getStylesheet().putCellStyle('input', inputStyle);
			addVertex(input, 15, 15, 'input');

			const outputStyle = {};
			outputStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
			outputStyle[mxConstants.STYLE_IMAGE] = circle;
			graph.getStylesheet().putCellStyle('output', outputStyle);
			addVertex(output, 15, 15, 'output');

			const loadedStyle = {};
			loadedStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
			loadedStyle[mxConstants.STYLE_IMAGE] = loaded;
			graph.getStylesheet().putCellStyle('loaded', loadedStyle);
			addVertex(loaded, 80, 56, 'loaded', 'loaded');
		}
	};

	render() {
		return (
			<>
				<div id="graphContainer" />
				<Link
					to={'/calculator'}
					style={{ position: 'absolute', top: '10px', right: '20px' }}
				>
					Calc
				</Link>
			</>
		);
	}
}

export default Editor;

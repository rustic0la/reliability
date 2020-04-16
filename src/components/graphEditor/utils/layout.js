import { mxHierarchicalLayout } from 'mxgraph-js';

const executeLayout = (graph, layout, change, post) => {
	graph.getModel().beginUpdate();
	try {
		mxHierarchicalLayout.prototype.resizeParent = true;
		mxHierarchicalLayout.prototype.maintainParentLocation = true;
		mxHierarchicalLayout.prototype.moveParent = true;
		mxHierarchicalLayout.prototype.intraCellSpacing = 15;
		mxHierarchicalLayout.prototype.interRankCellSpacing = 40;
		mxHierarchicalLayout.prototype.interHierarchySpacing = 30;
		mxHierarchicalLayout.prototype.parallelEdgeSpacing = 0;
		mxHierarchicalLayout.prototype.fineTuning = true;
		mxHierarchicalLayout.prototype.orientation = 'west';
		mxHierarchicalLayout.prototype.tightenToTarget = true;
		mxHierarchicalLayout.prototype.disableEdgeStyle = false;
		mxHierarchicalLayout.prototype.traverseAncestors = true;
		layout.execute(graph.getDefaultParent());
	} catch (e) {
		throw e;
	} finally {
		graph.getModel().endUpdate();
	}
};

export default executeLayout;

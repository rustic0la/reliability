import mx from '../../mxgraph';

const addSidebarIcon = (
    graph,
    sidebar,
    prototype,
    image,
    imgStyle = 'rectangle',
) => {
    const funct = (graph, evt, cell, x, y, imgStyle) => {
        graph.stopEditing(false);

        if (imgStyle === 'rectangle') {
            const parent = graph.getDefaultParent();
            graph.getModel().beginUpdate();
            try {
                const col1 = graph.insertVertex(
                    parent,
                    null,
                    '',
                    0,
                    0,
                    120,
                    0,
                    'column',
                );

                const v1 = graph.insertVertex(col1, null, '1', 0, 0, 100, 30);
                v1.collapsed = true;
                const vertex = graph.getModel().cloneCell(prototype);
                vertex.geometry.x = x;
                vertex.geometry.y = y;
                graph.addCell(vertex, col1);
                graph.setSelectionCell(vertex);
            } finally {
                // Updates the display
                graph.getModel().endUpdate();
            }
        } else {
            const vertex = graph.getModel().cloneCell(prototype);
            vertex.geometry.x = x;
            vertex.geometry.y = y;
            graph.addCell(vertex);
            graph.setSelectionCell(vertex);
        }
    };

    const img = sidebar.addMode(
        null,
        image,
        (evt, cell, imgStyle) => {
            const pt = this.graph.getPointForEvent(evt);
            funct(graph, evt, cell, pt.x, pt.y, imgStyle);
        },
        image,
        `${imgStyle}`,
    );

    mx.mxEvent.addListener(img, 'mousedown', (evt) => {
        if (img.enabled === false) {
            mx.mxEvent.consume(evt);
        }
    });

    mx.mxUtils.makeDraggable(img, graph, funct);

    return img;
};

const addVertex = (graph, sidebar, icon, w, h, style, imgStyle) => {
    const vertex = new mx.mxCell(null, new mx.mxGeometry(0, 0, w, h), style);
    vertex.setVertex(true);
    const img = addSidebarIcon(graph, sidebar, vertex, icon, imgStyle);
    img.enabled = true;
};

export default addVertex;

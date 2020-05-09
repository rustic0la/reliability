import { mxEvent, mxUtils } from "mxgraph-js";

const addToolbarButton = (
  undoManager,
  graph,
  toolbar,
  action,
  image,
  label = ""
) => {
  const button = document.createElement("button");
  button.style.fontSize = "10";
  button.style.marginRight = "10px";
  button.style.borderRadius = "18%";
  button.style.padding = "3px 8px";
  if (image !== null) {
    const img = document.createElement("img");
    img.setAttribute("src", image);
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.verticalAlign = "middle";
    img.style.marginRight = "2px";
    button.appendChild(img);
  }
  mxEvent.addListener(button, "click", () => {
    switch (action) {
      case "delete":
        graph.removeCells();
        break;
      case "zoomIn":
        graph.zoomIn();
        break;
      case "zoomOut":
        graph.zoomOut();
        break;
      case "zoomActual":
        graph.zoomActual();
        break;
      case "undo":
        undoManager.undo();
        break;
      case "redo":
        undoManager.redo();
        break;
      default:
        break;
    }
  });

  graph.getSelectionModel().addListener(mxEvent.CHANGE, function (sender, evt) {
    var cells = evt.getProperty("added");

    mxEvent.addListener(button, "click", () => {
      switch (action) {
        case "vertical":
          console.log('vert')
          break;
        case "horizontal":
			console.log('hor')
		  break;
		default:
        	break;
      }
    });
  });
  mxUtils.write(button, label);
  toolbar.appendChild(button);
};

export default addToolbarButton;

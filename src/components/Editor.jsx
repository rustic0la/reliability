import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import GraphContainer from "./GraphContainer";
import SchemeValidator from "./SchemeValidator";

const Editor = () => {
  const [graphNodes, setGraphNodes] = useState([]);
  
  return (
    <>
      <GraphContainer setGraphNodes={setGraphNodes} />
      <Link to={"/"} style={{ position: "absolute", top: "3px", left: "5px" }}>
        <Button
          onClick={() => {
            document.getElementById("close-btn").style.visibility = "visible";
          }}
          style={{
            fontSize: "16px",
            padding: "3px 10px",
            marginLeft: "5px",
            marginTop: "2px",
            background: "rgb(82, 74, 228)",
            color: "#fff",
          }}
        >
          Меню
        </Button>
      </Link>
      <SchemeValidator graphNodes={graphNodes} />
    </>
  );
};

export default Editor;

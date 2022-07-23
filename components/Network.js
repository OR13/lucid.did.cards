import ForceGraph3D from "react-force-graph-3d";

import { useRef } from "react";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

const idToContent = (id) => {
  let content = id;
  const jsonType = `^^http://www.w3.org/1999/02/22-rdf-syntax-ns#JSON`;
  if (content.includes(jsonType)) {
    content = JSON.stringify(
      JSON.parse(JSON.parse(content.split(jsonType)[0])),
      null,
      2
    );
  }

  const integerType = `^^http://www.w3.org/2001/XMLSchema#integer`;
  if (content.includes(integerType)) {
    content = content.split(integerType)[0].replace(/\"/g, "");
  }

  const dateTimeType = `^^http://www.w3.org/2001/XMLSchema#dateTime`;
  if (content.includes(dateTimeType)) {
    content = content.split(dateTimeType)[0].replace(/\"/g, "");
  }
  return content;
};

const Network = ({ graphData }) => {
  const fgRef = useRef();
  const extraRenderers = [new CSS2DRenderer()];

  return (
    <ForceGraph3D
      ref={fgRef}
      extraRenderers={extraRenderers}
      graphData={graphData}
      nodeLabel="id"
      // nodeAutoColorBy="group"
      linkWidth={1}
      backgroundColor={"#252525"}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      }}
      nodeThreeObjectExtend={true}
      nodeThreeObject={(node) => {
        const nodeEl = document.createElement("div");
        const content = idToContent(node.id);
        // hmm XSS....
        nodeEl.innerHTML = `<pre>${content}</pre>`;
        nodeEl.style.color = node.color;
        nodeEl.className = "node-label";
        return new CSS2DObject(nodeEl);
      }}
    />
  );
};

export default Network;

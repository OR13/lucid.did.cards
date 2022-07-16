import ForceGraph3D from "react-force-graph-3d";

import { useRef } from "react";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

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

        let content = node.id;
        if (
          content.includes(`^^http://www.w3.org/1999/02/22-rdf-syntax-ns#JSON`)
        ) {
          content = JSON.stringify(
            JSON.parse(
              JSON.parse(
                content.split(
                  `^^http://www.w3.org/1999/02/22-rdf-syntax-ns#JSON`
                )[0]
              )
            ),
            null,
            2
          );
        }
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

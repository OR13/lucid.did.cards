import { blue, amber, cyan, red, green } from "@mui/material/colors";

const jsonld = require("jsonld");
const axios = require("axios");

const documentLoader = async (iri) => {
  try {
    if (iri.startsWith("http")) {
      const response = await axios.get(iri, {
        headers: {
          accept: "application/json",
        },
      });
      return { document: response.data };
    }
  } catch (e) {
    console.error(e);
  }
  const message = "document loader does not support handle: " + iri;
  console.error(message);
  throw new Error(message);
};

const valueToGroup = (value) => {
  // URL
  if (value.startsWith("http")) {
    return 1;
  }
  // DID
  if (value.startsWith("did") && !value.includes("#")) {
    return 2;
  }
  // DID URL
  if (value.startsWith("did") && value.includes("#")) {
    return 3;
  }
  return 0;
};

const valueToColor = (value) => {
  // URL
  if (value.startsWith("http")) {
    return blue["200"];
  }
  // DID
  if (value.startsWith("did") && !value.includes("#")) {
    return green["500"];
  }
  // DID URL
  if (value.startsWith("did") && value.includes("#")) {
    return amber["500"];
  }

  return red["500"];
};

const documentToGraph = async (doc) => {
  // because of jsonld being so old... and new versions not working in nextjs
  doc["@context"].push({ "@base": doc.id });
  const canonized = await jsonld.canonize(doc, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader,
  });

  const nodes = {};
  const links = [];
  const rows = canonized.split("\n").filter((r) => r !== "");

  for (const row of rows) {
    const [subject, predicate, object] = row.split(" ");
    const subjectValue = subject.replace("<", "").replace(">", "");
    let objectValue = object.replace("<", "").replace(">", "");
    let predicateValue = predicate.replace("<", "").replace(">", "");

    if (!nodes[subjectValue]) {
      nodes[subjectValue] = {
        id: subjectValue,
        value: subjectValue,
        group: valueToGroup(subjectValue),
        color: valueToColor(subjectValue),
      };
    }
    if (!nodes[predicateValue]) {
      nodes[predicateValue] = {
        id: predicateValue,
        value: predicateValue,
        group: valueToGroup(predicateValue),
        color: valueToColor(predicateValue),
      };
    }
    if (!nodes[objectValue]) {
      nodes[objectValue] = {
        id: objectValue,
        value: objectValue,
        // TODO: handle JSON members better.... later...
        // value: objectValue.includes(
        //   "^^http://www.w3.org/1999/02/22-rdf-syntax-ns#JSON"
        // )
        //   ? JSON.parse(
        //       JSON.parse(
        //         objectValue.split(
        //           "^^http://www.w3.org/1999/02/22-rdf-syntax-ns#JSON"
        //         )[0]
        //       )
        //     )
        //   : objectValue,
        group: valueToGroup(objectValue),
        color: valueToColor(objectValue),
      };
    }

    links.push({
      source: subjectValue,
      target: predicateValue,
    });

    links.push({
      source: predicateValue,
      target: objectValue,
    });
  }
  return { nodes: Object.values(nodes), links };
};

const Graph = { documentToGraph };

export default Graph;

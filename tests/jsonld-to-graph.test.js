var Buffer = Buffer;

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

const doc = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1",
  ],
  id: "did:web:did.actor:supply-chain:manufacturer:carlos",
  verificationMethod: [
    {
      id: "#primary-signing-key",
      type: "JsonWebKey2020",
      controller: "did:web:did.actor:supply-chain:manufacturer:carlos",
      publicKeyJwk: {
        crv: "Ed25519",
        x: "pzjzbUzvcsSbHLk3uKjOb9pdN2mwnfeS5dEhQbzpHlQ",
        kty: "OKP",
      },
    },
  ],
  authentication: ["#primary-signing-key"],
  assertionMethod: ["#primary-signing-key"],
};

const documentToGraph = async (doc) => {
  let nodeId = 0;
  const getNodeId = () => {
    return nodeId++;
  };
  const canonized = await jsonld.canonize(doc, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader,
  });
  console.log(canonized);
  const nodes = {};
  const links = [];
  for (const row of canonized.split("\n")) {
    const [subject, predicate, object] = row.split(" ");
    const subjectId = getNodeId();
    const objectId = getNodeId();
    nodes[subject] = { id: subjectId, value: subject };
    nodes[object] = { id: objectId, value: object };
    links.push({ source: subjectId, target: objectId, value: predicate });
  }
  return { nodes: Object.values(nodes), links };
};

it("can convert jsonld to directed graph", async () => {
  const g = await documentToGraph(doc);
  // console.log(g);
  expect(g).toBeDefined();
});

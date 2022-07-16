import UniversalResolver from "../../../../services/UniversalResolver";
import Graph from "../../../../services/Graph";

export default async function handler(req, res) {
  const { did } = req.query;
  const result = await UniversalResolver.resolve(did);
  const graphData = await Graph.documentToGraph(result.didDocument);
  result.didResolutionMetadata.graphData = graphData;
  res.status(200).json(result);
}

import UniversalResolver from "../../../services/UniversalResolver";

export default async function handler(req, res) {
  const { did } = req.query;
  const result = await UniversalResolver.resolve(did);
  res.status(200).json(result);
}

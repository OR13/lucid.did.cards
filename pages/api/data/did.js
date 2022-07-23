import UniversalResolver from "../../../services/UniversalResolver";

export default async function handler(req, res) {
  console.log(req.query);
  const { did } = req.query;
  const resolution = await UniversalResolver.resolve(did);

  const actions = {
    resolve: {
      id: `http://localhost:3000/api/data/did?id=${did}`,
    },
    issueCredential: {
      id: `https://api.did.actor/capability?action=issue-from&id=${did}`,
    },
    encryptTo: {
      id: `https://api.did.actor/capability?action=encrypt-to&id=${did}`,
    },
    // only the did controller can publish.
    publish: {
      id: `https://api.did.actor/capability?action=publish&id=${did}`,
    },
  };

  const actor = {
    ...resolution.didDocument,
    actions,
  };

  res.status(200).json(actor);
}

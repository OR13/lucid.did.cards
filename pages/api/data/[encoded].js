// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// https://api.did.actor/v/eJylkltz4iAcxb8LfTUJ5GIuT22tttqtttVedGeng4BKVJICMWrH775Eu_bytrszvABnDuf8_ryBU5IJzdYaJD_BTOtcJY5TlqVdenYmp44LUeQQySgTmuOFclYI1D6EHqd72YpYkq0ygjXPhLXgSlsudGGl_lUDnIIEFFIkRcFpEtAw9nEUWiT0A8uPKbLGYy-0fIKxz-IJDiZ184be5KwK9cgkn3A8XrDGMcbeVKmCSWNMjeecbZJt_WaueX_72ornryV9iB7n9Px6HdSbw-3zJJ-K7u3D2eVW5Jx0-dNEgIMHFoRdYG3eAqYstCAya4DixPUS1x8Z1Uf9vsa6UCB5O1T6gwHn3DYpbEx0Jp1vIJSD7FRl4gQeS4H7o-SHUVSk3p1rQH65agvK1iCB388_ofjLGGD3pVAxThnRx0YVS7bGy3zBEuR6lTiXWTapBO_Zm9QNAhT3-VSYyJJVP-QAyUCke4qua8HQQuEAogSGZlUUV_s5HhLdMD3L6H_M7uQfhr0vclvIPFNVD6wUk5_C1EBamtECtunMxpeE93inNWreD-76bdVett1uo10fLVuKuA9m393g5zveWyg-TIewvUCxbdOU9F5mKz8LOoo2lhebixQ1X54g88k63wZyOG7NZXm9LMNIdDYv3UsYnnmt1LPO74ObEY4aT150fXXnovVVFDYC-Sim_nkJdrvf6Ac4og
// eJylkltz4iAcxb8LfTUJ5GIuT22tttqtttVedGeng4BKVJICMWrH775Eu_bytrszvABnDuf8_ryBU5IJzdYaJD_BTOtcJY5TlqVdenYmp44LUeQQySgTmuOFclYI1D6EHqd72YpYkq0ygjXPhLXgSlsudGGl_lUDnIIEFFIkRcFpEtAw9nEUWiT0A8uPKbLGYy-0fIKxz-IJDiZ184be5KwK9cgkn3A8XrDGMcbeVKmCSWNMjeecbZJt_WaueX_72ornryV9iB7n9Px6HdSbw-3zJJ-K7u3D2eVW5Jx0-dNEgIMHFoRdYG3eAqYstCAya4DixPUS1x8Z1Uf9vsa6UCB5O1T6gwHn3DYpbEx0Jp1vIJSD7FRl4gQeS4H7o-SHUVSk3p1rQH65agvK1iCB388_ofjLGGD3pVAxThnRx0YVS7bGy3zBEuR6lTiXWTapBO_Zm9QNAhT3-VSYyJJVP-QAyUCke4qua8HQQuEAogSGZlUUV_s5HhLdMD3L6H_M7uQfhr0vclvIPFNVD6wUk5_C1EBamtECtunMxpeE93inNWreD-76bdVett1uo10fLVuKuA9m393g5zveWyg-TIewvUCxbdOU9F5mKz8LOoo2lhebixQ1X54g88k63wZyOG7NZXm9LMNIdDYv3UsYnnmt1LPO74ObEY4aT150fXXnovVVFDYC-Sim_nkJdrvf6Ac4og
// http://localhost:3000/api/data/eJylkltz4iAcxb8LfTUJ5GIuT22tttqtttVedGeng4BKVJICMWrH775Eu_bytrszvABnDuf8_ryBU5IJzdYaJD_BTOtcJY5TlqVdenYmp44LUeQQySgTmuOFclYI1D6EHqd72YpYkq0ygjXPhLXgSlsudGGl_lUDnIIEFFIkRcFpEtAw9nEUWiT0A8uPKbLGYy-0fIKxz-IJDiZ184be5KwK9cgkn3A8XrDGMcbeVKmCSWNMjeecbZJt_WaueX_72ornryV9iB7n9Px6HdSbw-3zJJ-K7u3D2eVW5Jx0-dNEgIMHFoRdYG3eAqYstCAya4DixPUS1x8Z1Uf9vsa6UCB5O1T6gwHn3DYpbEx0Jp1vIJSD7FRl4gQeS4H7o-SHUVSk3p1rQH65agvK1iCB388_ofjLGGD3pVAxThnRx0YVS7bGy3zBEuR6lTiXWTapBO_Zm9QNAhT3-VSYyJJVP-QAyUCke4qua8HQQuEAogSGZlUUV_s5HhLdMD3L6H_M7uQfhr0vclvIPFNVD6wUk5_C1EBamtECtunMxpeE93inNWreD-76bdVett1uo10fLVuKuA9m393g5zveWyg-TIewvUCxbdOU9F5mKz8LOoo2lhebixQ1X54g88k63wZyOG7NZXm9LMNIdDYv3UsYnnmt1LPO74ObEY4aT150fXXnovVVFDYC-Sim_nkJdrvf6Ac4og

import pako from "pako";
import base64url from "base64url";
import Graph from "../../../services/Graph";

const compact = (content) => {
  return base64url.encode(pako.deflate(Buffer.from(JSON.stringify(content))));
};

const expand = (message) => {
  if (message.includes(".")) {
    const [encodedHeader, encodedPayload, encodedSignature] =
      message.split(".");
    const header = JSON.parse(Buffer.from(encodedHeader, "base64"));
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64"));
    return { header, payload, signature: encodedSignature };
  }
  const expanded = pako.inflate(Buffer.from(message, "base64"));
  return JSON.parse(Buffer.from(expanded).toString());
};

const getType = (data) => {
  if (
    data?.type?.includes("VerifiableCredential") ||
    data.payload?.vc?.type.includes("VerifiableCredential")
  ) {
    return "VerifiableCredential";
  }
  if (
    data?.type?.includes("VerifiablePresentation") ||
    data.payload?.vp?.type.includes("VerifiablePresentation")
  ) {
    return "VerifiablePresentation";
  }
  return null;
};

export default async function handler(req, res) {
  const { encoded } = req.query;
  const data = expand(encoded);
  const type = getType(data);

  const actions = {
    VerifiableCredential: {
      // verify: {
      //   id: `https://api.did.actor/capability?action=verify-credential&credential=${encoded}`,
      // },
      // verifyLimited: {
      //   id: `https://api.did.actor/capability?action=verify-credential&credential=${encoded}&limit=['${data.issuer}']`,
      // },
      // issuer: {
      //   id: `http://localhost:3000/api/data/did?id=${data.issuer}`,
      // },
      // credentialSubject: {
      //   id: `http://localhost:3000/api/data/did?id=${data.credentialSubject.id}`,
      // },
      // issueCredentialToSubject: {
      //   id: `https://api.did.actor/capability?action=issue-to&id=${data.credentialSubject.id}`,
      // },
      // issueCredentialToIssuer: {
      //   id: `https://api.did.actor/capability?action=issue-to&id=${data.issuer}`,
      // },
      // issueFromCredentialSubject: {
      //   id: `https://api.did.actor/capability?action=issue-from&id=${data.credentialSubject.id}`,
      // },
      // issueFromCredentialIssuer: {
      //   id: `https://api.did.actor/capability?action=issue-from&id=${data.issuer}`,
      // },
      // encryptToIssuer: {
      //   id: `https://api.did.actor/capability?action=encrypt-to-issuer&credential=${encoded}&id=${data.issuer}`,
      // },
      // encryptToSubject: {
      //   id: `https://api.did.actor/capability?action=encrypt-to-subject&credential=${encoded}&id=${data.credentialSubject.id}`,
      // },
      // publishAsIssuer: {
      //   id: `https://api.did.actor/capability?action=publish&credential=${encoded}&id=${data.issuer}`,
      // },
      // publishAsSubject: {
      //   id: `https://api.did.actor/capability?action=publish&credential=${encoded}&id=${data.credentialSubject.id}`,
      // },
    },
    VerifiablePresentation: {},
  };
  let document = data;

  if (document.payload.vc) {
    document = document.payload.vc;
  } else if (document.payload.vp) {
    document = document.payload.vp;
  }

  const graphData = await Graph.documentToGraph(document);

  const actor = {
    id: "urn:base64:" + encoded,
    type: "Encoded" + type,
    decoded: data,
    actions: actions[type],
    graphData,
  };
  res.status(200).json(actor);
}

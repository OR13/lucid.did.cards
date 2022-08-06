import axios from "axios";


import didWeb from '@transmute/did-web';
import * as didKey from '@transmute/did-key.js';

const resolve = async (did) => {


  if (did.startsWith('did:web')){
    const didDocument = await didWeb.resolve(did);
    return  { didDocument, didResolutionMetadata: {}};
  }

  if (did.startsWith('did:key')){
    const {didDocument} = await didKey.resolve(did);
    return  { didDocument, didResolutionMetadata: {}};
  }

  const response = await axios.get(
    `https://dev.uniresolver.io/1.0/identifiers/${did}`,
    {
      headers: {
        accept: 'application/ld+json;profile="https://w3id.org/did-resolution"',
      },
    }
  );
  return response.data;
};

const UniversalResolver = { resolve };

export default UniversalResolver;

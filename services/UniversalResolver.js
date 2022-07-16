import axios from "axios";
const resolve = async (did) => {
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

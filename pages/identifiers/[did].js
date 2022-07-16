import Head from "next/head";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Theme from "../../components/Theme";

import { CircularProgress } from "@mui/material";

import QRCode from "../../services/QRCode";
const Network = dynamic(() => import("../../components/Network"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const did = context.params.did;
  const title = did;
  const image = await QRCode.didToImageUrl(did);
  const url = `https://lucid.did.cards/identifiers/${did}`;
  const description = `Decentralized Identifier Card`;
  return {
    props: {
      did,
      title,
      image,
      url,
      description,
    }, // will be passed to the page component as props
  };
}

export default function DIDCardPage({ did, title, image, url, description }) {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    (async () => {
      if (did) {
        const response = await fetch("/api/identifiers/" + did);
        const resolution = await response.json();
        console.log(resolution);
        setGraphData(resolution.didResolutionMetadata.graphData);
      }
    })();
  }, [did]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content="lucid.did.cards" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Head>
      <main>
        <Theme>
          {graphData === null ? (
            <div className="absolute-center">
              <CircularProgress color={"primary"} />
            </div>
          ) : (
            <>
              <Network graphData={graphData} />
            </>
          )}
        </Theme>
      </main>
    </>
  );
}

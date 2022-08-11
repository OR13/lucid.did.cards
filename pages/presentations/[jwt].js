import Head from "next/head";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Theme from "../../components/Theme";

import { CircularProgress } from "@mui/material";

// import QRCode from "../../services/QRCode";
const Network = dynamic(() => import("../../components/Network"), {
  ssr: false,
});

export async function getServerSideProps(context) {
  const jwt = context.params.jwt;
  const title = "VP";
  //   const image = await QRCode.didToImageUrl(did);
  //   const url = `https://lucid.did.cards/credentials/${did}`;
  const description = `Presentation Card`;
  return {
    props: {
      jwt,
      title,
      //   image,
      //   url,
      description,
    }, // will be passed to the page component as props
  };
}

export default function PresentationCardPage({
  jwt,
  title,
  //   image,
  //   url,
  description,
}) {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    (async () => {
      if (jwt) {
        const response = await fetch("/api/data/" + jwt);
        const resolution = await response.json();
        setGraphData(resolution.graphData);
      }
    })();
  }, [jwt]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
        {/* <meta property="og:url" content={url} /> */}
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={image} /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:domain" content="lucid.did.cards" />
        {/* <meta name="twitter:url" content={url} /> */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* <meta name="twitter:image" content={image} /> */}
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

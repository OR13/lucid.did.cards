import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Theme from "../../components/Theme";

import { CircularProgress } from "@mui/material";
const Network = dynamic(() => import("../../components/Network"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [graphData, setGraphData] = useState(null);
  const did = router.query.did;
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
        <title>Lucid Cards</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
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

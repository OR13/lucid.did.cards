import Head from "next/head";

import dynamic from "next/dynamic";
import Theme from "../components/Theme";
const CanvasApp = dynamic(() => import("../components/CanvasApp"), {
  ssr: false,
});
import { useRouter } from "next/router";

import { Paper, Box, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [did, setDid] = useState(
    "did:web:did.actor:supply-chain:manufacturer:carlos"
  );

  const title = "Lucid Cards";
  // const image = await QRCode.didToImageUrl(did);
  const url = `https://lucid.did.cards`;
  const description = `Decentralized Identifier Cards`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={image} /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:domain" content="lucid.did.cards" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* <meta name="twitter:image" content={image} /> */}
      </Head>
      <main>
        <Theme>
          <CanvasApp />
          <Paper className="resolver-bar">
            <Box>
              <TextField
                label={"Decentralized Identifier"}
                value={did}
                fullWidth
                onChange={(event) => {
                  setDid(event.target.value);
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant={"contained"}
                onClick={() => {
                  router.push("/identifiers/" + did);
                }}
              >
                Resolve
              </Button>
            </Box>
          </Paper>
        </Theme>
      </main>
    </>
  );
}

import Head from "next/head";

import dynamic from "next/dynamic";
import Theme from "../components/Theme";
const CanvasApp = dynamic(() => import("../components/CanvasApp"), {
  ssr: false,
});
import { useRouter } from "next/router";

import { Paper, Box, TextField, Button } from "@mui/material";

const did = "did:web:did.actor:supply-chain:manufacturer:carlos";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Lucid Cards</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
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
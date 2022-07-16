import Head from "next/head";

import dynamic from "next/dynamic";

const CanvasApp = dynamic(() => import("../components/CanvasApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Lucid Cards</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CanvasApp />
      </main>
    </>
  );
}

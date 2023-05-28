import type { NextPage } from 'next';
import Head from 'next/head';

const Ideas: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wayl</title>
        <meta name="wayl" content="What are you listening to?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">Ideas</main>
    </>
  );
};

export default Ideas;

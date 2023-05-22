import { SignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import { PageLayout } from '~/components/layout';

const Feed: NextPage = () => {
  return <PageLayout>Feed</PageLayout>;
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wayl</title>
        <meta name="wayl" content="What are you listening to?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <SignedOut>
          <div className="flex h-full items-center justify-center">
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <Feed />
        </SignedIn>
      </main>
    </>
  );
};

export default Home;

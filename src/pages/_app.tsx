import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { PageLayout } from '~/components/layout';
import '~/styles/globals.css';
import { api } from '~/utils/api';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
        elements: { footerAction__signIn: 'hidden' },
      }}
    >
      <Head>
        <title>Wayl</title>
        <meta name="author" content="Adam Turowski" />
        <meta name="keywords" content="music, share, friends" />
        <meta
          name="description"
          content="Share your favourite music with your friends. New theme dropping daily."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            backgroundColor: '#171717',
            color: 'white',
          },
        }}
      />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { type AppType } from 'next/app';
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
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

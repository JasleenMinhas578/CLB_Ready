import { Suspense } from 'react';
import { SessionProvider } from './session';
import { matchPath, useHashPath } from './router';
import { ROUTES } from './routes';
import { Layout } from '@/components/Layout';
import { NotFound } from '@/components/NotFound';

function CurrentScreen() {
  const path = useHashPath();
  for (const route of ROUTES) {
    const params = matchPath(route.pattern, path);
    if (params) {
      const Screen = route.component;
      return <Screen params={params} />;
    }
  }
  return <NotFound />;
}

export function App() {
  return (
    <SessionProvider>
      <Layout>
        <Suspense fallback={<p className="loading-line">Loading…</p>}>
          <CurrentScreen />
        </Suspense>
      </Layout>
    </SessionProvider>
  );
}

import { Suspense } from 'react';
import { SessionProvider } from './session';
import { matchPath, useHashPath, type RouteParams } from './router';
import { ROUTES, type RouteDef } from './routes';
import { Layout } from '@/components/Layout';
import { ExamLayout } from '@/components/ExamLayout';
import { NotFound } from '@/components/NotFound';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function findRoute(path: string): { route: RouteDef; params: RouteParams } | null {
  for (const route of ROUTES) {
    const params = matchPath(route.pattern, path);
    if (params) return { route, params };
  }
  return null;
}

export function App() {
  const path = useHashPath();
  const match = findRoute(path);
  const Frame = match?.route.layout === 'exam' ? ExamLayout : Layout;
  const Screen = match?.route.component;

  return (
    <SessionProvider>
      <Frame>
        <ErrorBoundary key={path}>
          <Suspense fallback={<p className="loading-line">Loading…</p>}>
            {Screen && match ? <Screen params={match.params} /> : <NotFound />}
          </Suspense>
        </ErrorBoundary>
      </Frame>
    </SessionProvider>
  );
}

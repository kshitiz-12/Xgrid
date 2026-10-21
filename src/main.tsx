import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const CHUNK_RELOAD_KEY = 'sb-chunk-reload';

function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    message
  );
}

function reloadOnceForStaleChunks() {
  try {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1') return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
  } catch {
    // sessionStorage may be blocked; still attempt a single reload
  }
  window.location.reload();
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadOnceForStaleChunks();
});

window.addEventListener('load', () => {
  try {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  } catch {
    /* ignore */
  }
});

class ChunkLoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(error: unknown) {
    return { failed: isChunkLoadError(error) };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    if (isChunkLoadError(error)) reloadOnceForStaleChunks();
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 text-center text-slate-600">
          Updating the app… refresh if this stays.
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <ChunkLoadBoundary>
        <App />
      </ChunkLoadBoundary>
    </HelmetProvider>
  </StrictMode>
);

// Pages pre-rendered by scripts/prerender.mjs already contain markup; take it over instead of repainting.
if (rootEl.firstElementChild) hydrateRoot(rootEl, app);
else createRoot(rootEl).render(app);

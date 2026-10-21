import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom';
import { AppShell } from './App';

export type RenderResult = { html: string; head: string };

export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};

  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk.toString();
        done();
      },
    });
    sink.on('finish', () => {
      const h = helmetContext.helmet;
      const head = h
        ? [h.title, h.meta, h.link, h.script].map((part) => part.toString()).filter(Boolean).join('\n    ')
        : '';
      resolve({ html, head });
    });

    const stream = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <AppShell />
          </StaticRouter>
        </HelmetProvider>
      </StrictMode>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError: reject,
        onError(error) {
          reject(error);
        },
      }
    );
  });
}

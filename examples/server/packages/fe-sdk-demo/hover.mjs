import { JSX } from 'typedoc';

export async function load(app) {
  app.renderer.hooks.on('head.end', (ctx) => {
    return JSX.createElement('script', {
      defer: true,
      src: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    });
  });
}

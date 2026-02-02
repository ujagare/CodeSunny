export default function preloadCSS() {
  return {
    name: 'preload-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)"/g,
        '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'" /><noscript><link rel="stylesheet" crossorigin href="$1"</noscript>'
      );
    },
  };
}

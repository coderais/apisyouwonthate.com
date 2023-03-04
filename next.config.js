const redirects = require('./redirects');

// for oembed support: https://mdxjs.com/guides/embed/#embeds-at-compile-time
const fauxRemarkEmbedder = require('@remark-embedder/core');
const fauxOembedTransformer = require('@remark-embedder/transformer-oembed');
const remarkEmbedder = fauxRemarkEmbedder.default;
const oembedTransformer = fauxOembedTransformer.default;

// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [[remarkEmbedder, { transformers: [oembedTransformer] }]],
    rehypePlugins: [],
  },
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withMDX({
    /* NOTE: you may be here to add localization settings that look something like what's below.
        these work well out of the box for next.js, but they cause next-sitemap to generate a sitemap
        which contains urls that look like apisyouwonthate.com/en-us/:splat in addition to URLs without
        locale stuck in the middle. This has had a negative effect on SEO because our canonical links
        do _not_ currently include /en-us/ in them. If this setting is turned on in the future, we will need
        to update logic for generating canonical links, and possible set up 301 redirects for the old (current)
        canonical URLs. 
        
        For now, to avoid rendering a production site without a  "lang" attribute in the <html> tag, we are
        implementing /pages/_document.js per https://nextjs.org/docs/advanced-features/custom-document
    */
    // i18n: {
    //   locales: ['en-US'],
    //   defaultLocale: 'en-US',
    //   domains: [
    //     {
    //       domain: 'apisyouwonthate.com',
    //       defaultLocale: 'en-US',
    //     },
    //   ],
    // },
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    images: {
      domains: ['i.ytimg.com', 'remotive.com'],
    },
    async redirects() {
      return redirects;
    },
  })
);

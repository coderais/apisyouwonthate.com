module.exports = [
  {
    source: '/authors',
    destination: '/about',
    permanent: false,
  },
  {
    source: '/podcast/rss',
    destination: 'https://feeds.transistor.fm/apis-you-wont-hate',
    permanent: false,
  },
  {
    source: '/sitemap/sitemap-index.xml',
    destination: '/sitemap/sitemap.xml',
    permanent: false,
  },
  {
    source: '/sitemap/sitemap-0.xml',
    destination: '/sitemap/sitemap.xml',
    permanent: false,
  },

  // Books used to have a .html extension
  {
    source: '/books/:book.html',
    destination: '/books/:book',
    permanent: true,
  },

  // Old Medium URLs
  {
    source: '/rest-and-hypermedia-in-2019-76cb3421e745',
    destination: '/blog/rest-and-hypermedia-in-2019',
    permanent: true,
  },
  {
    source:
      '/resolving-overloaded-terms-for-api-specifications-descriptions-contracts-c31a6d44d269',
    destination:
      '/blog/resolving-overloaded-terms-for-api-specifications-descriptions-contract',
    permanent: true,
  },
  {
    source: '/organizing-your-asyncapi-documents-4bedc1b3eb05',
    destination: '/blog/organizing-your-asyncapi-documents',
    permanent: true,
  },
  {
    source: '/caching-is-hard-draw-me-a-picture-updated-cdb354cbf3d0',
    destination: '/blog/caching-is-hard-draw-me-a-picture',
    permanent: true,
  },
  {
    source: '/a-happy-compromise-between-customization-and-cacheability-:id',
    destination:
      '/blog/partials-happy-compromise-between-customization-and-cacheability',
    permanent: true,
  },
  {
    source: '/useful-api-errors-for-rest-graphql-and-grpc-897efa851165',
    destination: '/blog/creating-good-api-errors-in-rest-graphql-and-grpc',
    permanent: true,
  },
  {
    source: '/taking-a-timeout-from-poor-performance-473965255009',
    destination: '/blog/taking-a-timeout-from-poor-performance',
    permanent: true,
  },
  {
    source: '/weworks-api-specification-workflow-defec45cc037',
    destination: '/blog/weworks-api-specification-workflow',
    permanent: true,
  },
  {
    source: '/api-versioning-has-no-right-way-f3c75457c0b7',
    destination: '/blog/api-versioning-has-no-right-way',
    permanent: true,
  },
  {
    source: '/api-evolution-for-rest-http-apis-b4296519e564',
    destination: '/blog/api-evolution-for-rest-http-apis',
    permanent: true,
  },
  {
    source: '/common-hypermedia-patterns-with-json-hyper-schema-17c78cf884ff',
    destination: '/blog/common-hypermedia-patterns-with-json-hyper-schema',
    permanent: true,
  },
  {
    source: '/creating-api-specifications-from-bulls-t-:id',
    destination: '/blog/creating-api-specifications-from-bullst',
    permanent: true,
  },
  {
    source: '/getting-started-with-json-hyper-schema-184775b91f',
    destination: '/blog/getting-started-with-json-hyper-schema',
    permanent: true,
  },
  {
    source: '/getting-started-with-json-hyper-schema-part-2-ca9d7ffdf6f6',
    destination: '/blog/getting-started-with-json-hyper-schema-part-2',
    permanent: true,
  },
  {
    source: '/govern-your-apis-with-speccy-6a507dd68f56',
    destination: '/blog/govern-your-apis-with-speccy',
    permanent: true,
  },
  {
    source: '/graphql-vs-rest-caching-:id',
    destination: '/blog/graphql-vs-rest-caching',
    permanent: true,
  },
  {
    source: '/graphql-vs-rest-overview-:id',
    destination: '/blog/graphql-vs-rest-overview',
    permanent: true,
  },
  {
    source: '/guessing-api-contracts-:id',
    destination: '/blog/commit-to-api-contracts',
    permanent: true,
  },
  {
    source: '/health-checks-for-rest-grpc-apis-kubernetes-and-beyond-:id',
    destination: '/blog/health-checks-for-rest-grpc-apis-kubernetes-and-beyond',
    permanent: true,
  },
  {
    source: '/json-api-openapi-and-json-schema-working-in-harmony-:id',
    destination: '/blog/json-api-openapi-and-json-schema-working-in-harmony',
    permanent: true,
  },
  {
    source: '/keeping-documentation-honest-:id',
    destination: '/blog/keeping-documentation-honest',
    permanent: true,
  },
  {
    source: '/lets-stop-building-apis-around-a-network-hack-:id',
    destination: '/blog/lets-stop-building-apis-around-a-network-hack',
    permanent: true,
  },
  {
    source: '/making-the-most-of-json-api-:id',
    destination: '/blog/making-the-most-of-json-api',
    permanent: true,
  },
  {
    source: '/meet-the-api-community-:id',
    destination: '/blog/meet-the-api-community',
    permanent: true,
  },
  {
    source: '/openapi-and-json-schema-divergence-:id',
    destination: '/blog/openapi-and-json-schema-divergence',
    permanent: true,
  },
  {
    source: '/openapi-and-json-schema-divergence-part-2-:id',
    destination: '/blog/openapi-v3-1-and-json-schema',
    permanent: true,
  },
  {
    source: '/blog/solving-openapi-and-json-schema-divergence',
    destination: '/blog/openapi-v3-1-and-json-schema',
    permanent: true,
  },
  {
    source: '/optimizing-for-the-speed-of-light-:id',
    destination: '/blog/optimizing-for-the-speed-of-light',
    permanent: true,
  },
  {
    source: '/picking-the-right-api-paradigm-:id',
    destination: '/blog/picking-api-paradigm',
    permanent: true,
  },
  {
    source: '/put-vs-patch-vs-json-patch-:id',
    destination: '/blog/put-vs-patch-vs-json-patch',
    permanent: true,
  },
  {
    source: '/remote-api-consulting-:id',
    destination: '/blog/remote-api-consulting',
    permanent: true,
  },
  {
    source: '/representing-state-in-rest-and-graphql-:id',
    destination: '/blog/representing-state-in-rest-and-graphql',
    permanent: true,
  },
  {
    source:
      '/speeding-up-apis-apps-smart-toasters-with-http-response-caching-:id',
    destination: '/blog/http-client-response-caching',
    permanent: true,
  },
  {
    source:
      '/surviving-deprecations-to-resources-and-properties-on-other-apis-9711e7def610',
    destination:
      '/blog/surviving-deprecations-to-resources-and-properties-on-other-apis',
    permanent: true,
  },
  {
    source: '/the-many-amazing-uses-of-json-schema-client-side-validation-:id',
    destination:
      '/blog/json-schema-client-side-validation',
    permanent: true,
  },
  {
    source:
      '/tricking-colleagues-into-writing-documentation-via-contract-testing-206308b47e05',
    destination: '/blog/writing-documentation-via-contract-testing',
    permanent: true,
  },
  {
    source: '/turning-contracts-into-beautiful-documentation-:id',
    destination: '/blog/turning-contracts-into-beautiful-documentation',
    permanent: true,
  },
  {
    source: '/understanding-rpc-rest-and-graphql-:id',
    destination: '/blog/understanding-rpc-rest-and-graphql',
    permanent: true,
  },
  {
    source: '/what-is-api-rate-limiting-all-about-:id',
    destination: '/blog/what-is-api-rate-limiting-all-about',
    permanent: true,
  },
  {
    source: '/why-do-people-dislike-json-:id',
    destination: '/blog/why-some-people-dislike-json',
    permanent: true,
  },
  {
    source: '/you-might-not-need-graphql-:id',
    destination: '/blog/you-might-not-need-graphql',
    permanent: true,
  },

  // Renamed Articles
  {
    source: '/blog/annotations-dsls-and-guis-for-api-descriptions',
    destination: '/blog/theres-no-reason-to-write-openapi-by-hand',
    permanent: true,
  },
  {
    source: '/blog/openapi-v31-and-json-schema-2019-09',
    destination: '/blog/openapi-v3-1-and-json-schema',
    permanent: true,
  },
  {
    source: '/blog/openapi-v31-and-json-schema',
    destination: '/blog/openapi-v3-1-and-json-schema',
    permanent: true,
  },
  {
    source: '/blog/the-many-amazing-uses-of-json-schema-client-side-validation',
    destination:
      '/blog/json-schema-client-side-validation',
    permanent: true,
  },
  {
    source: '/authors/marc-andre-giroux',
    destination: '/authors/marc-giroux',
    permanent: false,
  },
];

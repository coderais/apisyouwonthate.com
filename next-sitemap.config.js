const config = require('./config');

module.exports = {
  siteUrl: process.env.SITE_URL || config.siteMetadata.siteUrl,
  generateRobotsTxt: process.env.CONTEXT === 'production', // only generate robots.txt for prod

  transform: async (config, path) => {
    // trying to remove all remotive jobs from sitemap - they will start with `/jobs/` and end with a dash and a number `-123456`
    const remotiveJobsRegEx = /^\/jobs\/.*-\d*$/gm;
    if (remotiveJobsRegEx.test(path)) return null;

    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },

  // ...other options
};

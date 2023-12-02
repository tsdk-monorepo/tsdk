const { execSync } = require('child_process');
const fs = require('fs');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tsdk.dev',
  generateRobotsTxt: true,
  transform: async (config, path) => {
    let filePath = `pages${path}.md`;
    const exist = fs.existsSync(filePath);

    if (!exist) {
      filePath += 'x';
    }

    const cmd = `git log -1 --format=%ct ${filePath}`;
    const result = execSync(cmd).toString();
    // Use default transformation for all other cases
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: result
        ? new Date(+result.toString() * 1000).toISOString()
        : config.autoLastmod
        ? new Date().toISOString()
        : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

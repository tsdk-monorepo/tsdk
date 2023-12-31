const withVideos = require('next-videos');
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra(
  withVideos({
    i18n: {
      locales: ['en-US', 'zh-CN'],
      defaultLocale: 'en-US',
    },

    webpack(config, options) {
      return config;
    },
  })
);

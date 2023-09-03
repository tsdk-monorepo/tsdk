// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '%PROJECT NAME%',
  tagline: '',
  url: 'HTTPS://PROJECTSITE.COM',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'YOUR NAME', // Usually your GitHub org/user name.
  projectName: '%PROJECT NAME%', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // onBrokenLinks: 'ignore',
  // onBrokenMarkdownLinks: 'ignore',
  onDuplicateRoutes: 'ignore',

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      // Plugin / TypeDoc options
      {
        entryPoints: ['../src'],
        entryPointStrategy: 'expand',
        tsconfig: '../tsconfig.json',
        sidebar: {
          categoryLabel: 'API Reference',
          position: 99,
          fullNames: true,
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links. @todo
          editUrl: 'https://github.com/YOUR REPO/tree/main/website/',
        },
        blog: false, // Optional: disable the blog plugin
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // image: 'img/og-image.png',
      navbar: {
        title: '%PROJECT NAME% Docs'.toUpperCase(),
        logo: {
          alt: '%PROJECT NAME% logo',
          srcDark: 'img/logo.svg',
          src: 'img/logo.svg',
          href: '/docs',
        },

        items: [
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
          // {
          //   href: 'https://github.com/YOUR REPO',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: `Copyright © ${new Date().getFullYear()} %PROJECT NAME%.`,
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

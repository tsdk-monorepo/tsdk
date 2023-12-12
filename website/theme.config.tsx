import Image from 'next/image';
import { useRouter } from 'next/router';
import { DocsThemeConfig, LocaleSwitch } from 'nextra-theme-docs';
import React from 'react';

import logo from './static/img/logo.svg';

const config: DocsThemeConfig = {
  logo: (
    <div className="animate--animated" data-scroll-active="animate--flipInX">
      <Image src={logo} alt="tsdk logo" height={48} />
    </div>
  ),
  useNextSeoProps() {
    const description = 'tsdk: type-safe API development and Code share tool';
    const { asPath } = useRouter();
    const common = {
      description,
      openGraph: {
        images: [{ url: 'https://tsdk.dev/og.jpg' }],
      },
      twitter: {
        cardType: 'summary_large_image',
        site: 'https://tsdk.dev',
      },
      additionalMetaTags: [{ content: 'tsdk', name: 'apple-mobile-web-app-title' }],
    };
    if (asPath !== '/' && asPath !== '/docs/intro') {
      return {
        titleTemplate: '%s – tsdk',
        ...common,
      };
    }
    return {
      ...common,
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="tsdk" />
      <meta property="og:description" content="type-safe API development and Code share tool" />
    </>
  ),
  navbar: {
    extraContent: <LocaleSwitch />,
  },
  project: {
    link: 'https://github.com/tsdk-monorepo/tsdk',
  },
  docsRepositoryBase: 'https://github.com/tsdk-monorepo/tsdk/tree/main/website',
  footer: {
    text: (
      <div className="flex gap-x-6">
        <div>Copyright @ {new Date().getFullYear()}</div>
        <a href="https://github.com/suhaotian">@suhaotian</a>
        <a href="https://github.com/tsdk-monorepo">GitHub</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    ),
  },
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'zh-CN', text: '中文' },
  ],
};

export default config;

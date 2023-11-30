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
    const { asPath } = useRouter();
    if (asPath !== '/' && asPath !== '/docs/intro') {
      return {
        titleTemplate: '%s – tsdk',
      };
    }
  },
  navbar: {
    extraContent: <LocaleSwitch />,
  },
  project: {
    link: 'https://github.com/tsdk-monorepo/tsdk',
  },
  docsRepositoryBase: 'https://github.com/tsdk-monorepo/tsdk/tree/main/website',
  footer: {
    text: 'Copyright @ 2023',
  },
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'zh-CN', text: '中文' },
  ],
};

export default config;
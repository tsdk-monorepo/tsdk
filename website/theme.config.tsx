import Image from 'next/image';
import { DocsThemeConfig } from 'nextra-theme-docs';
import React from 'react';

import logo from './static/img/logo.svg';

const config: DocsThemeConfig = {
  logo: (
    <div>
      <Image src={logo} alt="tsdk logo" height={48} />
    </div>
  ),
  project: {
    link: 'https://github.com/suhaotian/tsdk-monorepo',
  },
  docsRepositoryBase: 'https://github.com/suhaotian/tsdk-monorepo/website',
  footer: {
    text: 'Copyright @ 2023',
  },
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'zh-CN', text: '中文' },
  ],
};

export default config;

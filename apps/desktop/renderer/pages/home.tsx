// import { HomeScreen } from '@acme/feature-home';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
          <Link href="/">
            <a>Go to index page</a>
          </Link>
        </p>
        <img src="/images/logo.png" />
      </div>

      {/* <HomeScreen style={{ fontSize: 24, margin: 12 }} /> */}
    </React.Fragment>
  );
}

export default Home;

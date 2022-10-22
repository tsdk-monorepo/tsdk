import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

function Next() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/home">
            <a>Go to home page</a>
          </Link>
        </p>
      </div>
    </React.Fragment>
  );
}

export default Next;

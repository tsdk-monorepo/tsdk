// import { HomeScreen, HomeIcon } from '@acme/feature-home';
import {
  setHandler,
  setSocketIOInstance,
  socketIOHandler,
  setAxiosInstance,
  axiosHandler,
} from '@suhaotian/fe-sdk-example';
import { QueryTodo } from '@suhaotian/fe-sdk-example/lib/user-api';
import axios from 'axios';
import Head from 'next/head';
// eslint-disable-next-line import/namespace
import { io as SocketIO } from 'socket.io-client';

import styles from '../styles/Home.module.css';

(() => {
  const io = SocketIO('http://localhost:3012/', {
    transports: ['websocket'],
  });
  setSocketIOInstance(io);

  io.on('connect', async () => {
    setHandler(socketIOHandler);

    const wsRes = await QueryTodo({});

    console.log(wsRes);
    io.disconnect();

    setAxiosInstance(axios.create({ baseURL: 'http://localhost:3012/api' }));
    setHandler(axiosHandler);

    const httpRes = await QueryTodo({});
    console.log(httpRes);
  });
})();

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>[web] Expo monorepo</title>
        <meta name="description" content="Sharing code with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <HomeIcon style={{ fontSize: 64 }} /> */}
        {/* <HomeScreen style={{ fontSize: 24, margin: 12 }} /> */}
      </main>
    </div>
  );
}

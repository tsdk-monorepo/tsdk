// import { HomeScreen, HomeIcon } from '@acme/feature-home';
import axios from 'axios';
import {
  setHandler,
  setSocketIOInstance,
  socketIOHandler,
  setAxiosInstance,
  axiosHandler,
  getHandler,
} from 'fe-sdk-demo';
import { QueryTodoRes } from 'fe-sdk-demo/lib/apiconf-refs';
import { QueryTodo } from 'fe-sdk-demo/lib/user-api';
import Head from 'next/head';
import { useState, useEffect } from 'react';
// eslint-disable-next-line import/namespace
import { io as SocketIO } from 'socket.io-client';

import styles from '../styles/Home.module.css';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? '' //  @todo 使用环境变量打包
    : (() => {
        if (typeof window === 'undefined') return;
        return (
          window?.location.protocol + '//' + window?.location.host.split(':')[0] + ':' + 3012 + '/'
        );
      })();
const socketURL = baseURL;
const apiURL = baseURL + 'api';

export default function Home() {
  const [handlerName, setHanlderName] = useState('');
  const [result, setResult] = useState<QueryTodoRes>();

  useEffect(() => {
    const io = SocketIO(socketURL, {
      transports: ['websocket'],
    });
    setSocketIOInstance(io);
    setHandler(socketIOHandler);

    setHanlderName(getHandler().name);

    io.on('connect', async () => {
      const wsRes = await QueryTodo({});

      console.log(wsRes);
      setResult(wsRes);

      io.disconnect();
      setTimeout(async () => {
        setAxiosInstance(axios.create({ baseURL: apiURL }));
        setHandler(axiosHandler);

        setHanlderName(getHandler().name);

        const httpRes = await QueryTodo({});
        console.log(httpRes);

        setResult(httpRes);
      }, 2500);
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>[web] Expo monorepo</title>
        <meta name="description" content="Sharing code with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        Hello, {handlerName}: {JSON.stringify(result)}
      </main>
    </div>
  );
}

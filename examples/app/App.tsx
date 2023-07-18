import axios from 'axios';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
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
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { io as SocketIO } from 'socket.io-client';

import '@total-typescript/ts-reset';

const { manifest } = Constants;
const baseURL =
  // process.env.NODE_ENV === 'production'
  //   ? '' //  @todo 使用环境变量打包
  //   :
  (() => {
    // TODO - put a "prod" api server somewhere
    // Android / IOS - no CORS issue.
    if (manifest && manifest.debuggerHost) {
      const debuggerHost = manifest.debuggerHost.split(':').shift();
      return 'http://' + debuggerHost + ':3012/';
    } else {
      // Expo Web client, making use of webpack.config.js (see original question) for devServer proxy.
      return '/';
    }
  })();
const apiType = 'user';
const socketURL = baseURL;
const apiURL = baseURL + `api/${apiType}`;

export default function App() {
  const [handlerName, setHanlderName] = useState('');
  const [result, setResult] = useState<QueryTodoRes>();

  useEffect(() => {
    const io = SocketIO(socketURL, {
      transports: ['websocket'],
      query: {
        type: apiType,
      },
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
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>
        Hello, {handlerName}: {JSON.stringify(result)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

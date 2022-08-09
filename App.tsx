import React from 'react';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {persistor, store} from '@/store';
import Routes from '@/Routes';
import {PersistGate} from 'redux-persist/integration/react';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <Routes />
      </PersistGate>
    </Provider>
  );
}

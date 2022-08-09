import {applyMiddleware, combineReducers, createStore} from '@reduxjs/toolkit';
import {loginReducer, loginSetStore} from '@/store/login';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {historyReducer, setHistoryStore} from '@/store/history';
import {composeWithDevTools} from 'redux-devtools-extension';
import {
  mobileClientsReducer,
  setMobileClientsStore,
} from '@/store/checkInClient';

const middlewares: any[] = [];

const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

const appReducer = combineReducers({
  login: loginReducer,
  history: historyReducer,
  mobileClients: mobileClientsReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    whitelist: ['login'], // if you want to persist something, put it here
    storage: AsyncStorage,
  },
  appReducer,
);

export const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);

loginSetStore(store);
setHistoryStore(store);
setMobileClientsStore(store);

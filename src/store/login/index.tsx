import {
  combineReducers,
  createSlice,
  PayloadAction,
  Store,
} from '@reduxjs/toolkit';
import {MobileClient, RawClient} from '@/types';
import {useSelector} from 'react-redux';

const initialState = {};
const initialClient = {};
const initialMobileClients: MobileClient[] = [];

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

const client = createSlice({
  name: 'client',
  initialState: initialClient,
  reducers: {
    setClient: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        return {
          ...state,
          ...action.payload,
        };
      }

      return null;
    },
  },
});

const mobileClients = createSlice({
  name: 'mobileClients',
  initialState: initialMobileClients,
  reducers: {
    setMobileClients: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        return action.payload;
      }

      return [];
    },
  },
});

export const loginReducer = combineReducers({
  user: user.reducer,
  client: client.reducer,
  mobileClients: mobileClients.reducer,
});

let _store: Store | undefined;

export const loginSetStore = (store: Store) => {
  _store = store;
};

export const setClientAction = (data?: RawClient) => {
  _store && _store.dispatch(client.actions.setClient(data));
};

export const setMobileClientsAction = (data: RawClient) => {
  _store && _store.dispatch(mobileClients.actions.setMobileClients(data));
};

export const useClient = () => {
  return useSelector((state: any) => state.login.client);
};

export const useMobileClients = () => {
  return useSelector((state: any) => state.login.mobileClients);
};

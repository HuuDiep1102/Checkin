import {createDynamicReducer} from '@/utils/createDynamicReducer';
// @ts-ignore
import {batch} from 'react-redux';
import {MobileClient} from '@/types';
import moment from 'moment';

const {setStore, reducer, sync, useByKey, setQueries, useKeysByQuery} =
  createDynamicReducer<any>('mobileClients', 'office_id');

export const setMobileClientsStore = setStore;
export const mobileClientsReducer = reducer;
export const syncMobileClients = sync;
export const useMobileClients = useByKey;
export const setMobileClientsQueries = setQueries;
export const useMobileClientsByQuery = useKeysByQuery;

export const syncAllMobileClient = (mobileClients: MobileClient[]) => {
  let ids: string[] = [];

  for (let client of mobileClients) {
    ids.push(client.office_id.toString());
  }

  batch(() => {
    syncMobileClients(mobileClients);
    setMobileClientsQueries({
      all: ids,
    });
  });
};

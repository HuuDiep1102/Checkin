import {createDynamicReducer} from '@/utils/createDynamicReducer';
// @ts-ignore
import {batch} from 'react-redux';
import {RawHistory} from '@/types';
import moment from 'moment';

const {setStore, reducer, sync, useByKey, setQueries} =
  createDynamicReducer<any>('history', 'date');

export const setHistoryStore = setStore;
export const historyReducer = reducer;
export const syncHistory = sync;
export const useHistory = useByKey;
export const setHistoryQueries = setQueries;

export const syncAllHistory = (history: RawHistory[]) => {
  let ids: string[] = [];
  let _history = history.map(item => {
    const date = moment(item.date, 'X').format('YYYY-MM-DD');
    ids.push(date);

    return {
      ...item,
      date,
    };
  });

  batch(() => {
    syncHistory(_history);
    setHistoryQueries({
      all: ids,
    });
  });
};

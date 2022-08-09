import {Fetch} from '@/utils/fetch';
import {setClientAction, setMobileClientsAction} from '@/store/login/index';
import {PayloadPostClientsProps} from '@/types';
import {newFormData} from '@/utils/formData';

export const requestSecret = async () => {
  const {data} = await Fetch.get('api.base.vn/extapi/oauth/client');

  if (!data) {
    return null;
  }

  setClientAction(data.client);
  return {
    client_key: data?.client?.client_key,
    client_secret: data?.client?.client_secret,
  };
};

export const requestLogin = async (email: string, password: string) => {
  const client = await requestSecret();

  if (!client) {
    return null;
  }

  const loginFormData = newFormData({
    client_key: client.client_key,
    client_secret: client.client_secret,
    email,
    password,
    __code: 'native',
  });

  const {data} = await Fetch.post(
    'api.base.vn/ajax/mobile/login',
    loginFormData,
  );
  if (!data) {
    return null;
  }
  if (data.code) {
    setClientAction(data.client);
  }

  return data.code;
};

export const requestLogout = async (params: any) => {
  const logoutFormData = newFormData(params);

  const {data} = await Fetch.post(
    'api.base.vn/extapi/oauth/logout',
    logoutFormData,
  );

  if (!data) {
    return null;
  }
  setClientAction();

  return data;
};

export const getClients = async (payload: PayloadPostClientsProps) => {
  const _formData = newFormData(payload);

  const {data} = await Fetch.post(
    'checkin.base.vn/ajax/api/me/clients',
    _formData,
  );

  if (!data) {
    return null;
  }

  if (data.mobile_clients) {
    setMobileClientsAction(data.mobile_clients);
  }

  return data.mobile_clients;
};

export const requestCheckin = async (payload: any) => {
  const _formData = newFormData(payload);

  const {data} = await Fetch.post(
    'checkin.base.vn/ajax/api/me/checkin/mobile',
    _formData,
  );

  return data.code;
};

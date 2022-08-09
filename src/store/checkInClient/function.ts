import {Fetch} from '@/utils/fetch';
import {newFormData} from '@/utils/formData';
import {PayloadPostClientsProps} from '@/types';
import {syncAllMobileClient} from '@/store/checkInClient';

export const requestGetMobileClients = async (
  payload: PayloadPostClientsProps,
) => {
  const _formData = newFormData(payload);

  const {data} = await Fetch.post(
    'checkin.base.vn/ajax/api/me/clients',
    _formData,
  );

  if (!data) {
    return null;
  }

  if (data.mobile_clients) {
    syncAllMobileClient(data.mobile_clients);
  }

  return data.mobile_clients;
};

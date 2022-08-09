export interface RawClient {
  client_key?: string;
  client_secret?: string;
  access?: string;
  user_id?: string;
  access_token?: string;
  ns?: string;
  nstoken?: string;
  checkin_token?: string;
}

export interface PayloadPostClientsProps {
  access_token: string;
  client_key: string;
  client_auth: number;
  __code: string;
  lat: number;
  lng: number;
}

export interface MobileClient {
  id: string;
  office_id: string;
  name: string;
  metatype: string;
  ips: [];
  since: string;
  last_update: string;
  require_confirm: number;
  config: {
    gps: string;
    gps_only: string;
    radius: string;
    require_confirm: number;
    confirmed_by: string[];
    verify_office: number;
    verify_timesheet: number;
  };
  public_token: string;
  password: string;
  lat: string;
  lng: string;
  radius: string;
}

export interface Permission {
  checkin: boolean;
  camera: boolean;
  location: boolean;
}

export interface RawHistory {
  id: string;
  user_id: string;
  employee_id: string;
  date: string;
  month_index: string;
  timesheet_id: string;
  computed: {};
  finalized: {};
  logs: Log[];
  hid: string;
  token: string;
  type: string;
  stats: {
    comments: number;
  };
}

export interface Log {
  ip: string;
  client_id: string;
  office_id: string;
  time: number;
  metatype: string;
  lat: string;
  lng: string;
  img: string;
  checkout: number;
  note: string;
  files: [];
}

import {
  check,
  openSettings,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {Platform} from 'react-native';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const REQUEST_PERMISSION_TYPE = {
  camera: PLATFORM_CAMERA_PERMISSIONS,
  location: PLATFORM_LOCATION_PERMISSIONS,
};

export const PERMISSIONS_TYPE = {
  camera: 'camera',
  location: 'location',
};

export const checkPermission = async (
  type: string,
  isRequest?: boolean,
): Promise<boolean> => {
  // @ts-ignore
  const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
  if (!permissions) {
    return true;
  }
  try {
    const result = await check(permissions);
    if (result === RESULTS.GRANTED) {
      return true;
    }
    if (!isRequest) {
      return false;
    }
    return requestPermission(permissions);
  } catch (error) {
    return false;
  }
};

export const requestPermission = async (
  permissions: Permission,
): Promise<boolean> => {
  try {
    const result = await request(permissions);
    return result === RESULTS.GRANTED;
  } catch (error) {
    return false;
  }
};

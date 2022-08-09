import {memo, useCallback, useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

export const useLocation = () => {
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const watchID = useRef<any>();

  const getOneTimeLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //Setting Longitude state
        setLongitude(position.coords.longitude);

        //Setting Longitude state
        setLatitude(position.coords.latitude);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000,
      },
    );
  }, [Geolocation]);

  const subscribeLocationLocation = useCallback(() => {
    watchID.current = Geolocation.watchPosition(
      position => {
        //Setting Longitude state
        setLongitude(position.coords.longitude);

        //Setting Longitude state
        setLatitude(position.coords.latitude);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  }, []);

  useEffect(() => {
    getOneTimeLocation();
    subscribeLocationLocation();

    return () => {
      Geolocation.clearWatch(watchID.current);
    };
  }, []);

  return {latitude, longitude};
};

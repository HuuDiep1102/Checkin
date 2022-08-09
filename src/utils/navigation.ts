import React from 'react';
import {
  DrawerActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

import {TransitionPresets} from '@react-navigation/stack';
import {LoginScreen} from '@/screens/Login/LoginScreen';

import {HomeScreen} from '@/screens/Home/HomeScreen';

import {PreloadScreen} from '@/screens/PreloadScreen';

import {CheckInScreen} from '@/screens/CheckIn/CheckInScreen';

// import {DetailScreenProps, CreateScreenProps} from '@/types';

export const defaultScreenOptions = TransitionPresets.SlideFromRightIOS;

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const navigation = () => navigationRef.current!;

export const createNavigate =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    return navigation().navigate(screenName, params);
  };

export const createReplace =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(StackActions.replace(screenName, params));
  };

export const reset = () =>
  navigation().reset({
    index: 0,
    routes: [
      {
        name: 'PreloadScreen',
      },
    ],
  });

export const openDrawer = () =>
  navigation().dispatch(DrawerActions.openDrawer());

export const replaceWithMainScreen = createReplace('Draw');

export const navigateToLoginScreen = createNavigate('LoginScreen');

export const replaceWithWelcomeScreen = createReplace('WelcomeScreen');

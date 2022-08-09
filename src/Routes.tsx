import React, {memo, useCallback} from 'react';
import {WelcomeScreen} from '@/screens/Login/WelcomeScreen';
import {LoginScreen} from '@/screens/Login/LoginScreen';
import {HomeScreen} from '@/screens/Home/HomeScreen';
import {navigationRef} from '@/utils/navigation';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {PreloadScreen} from '@/screens/PreloadScreen';
import DrawCustome from '@/components/DrawCustome';
import {CheckPermissionScreen} from '@/screens/CheckIn/CheckPermissionScreen';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const DrawerStack = createDrawerNavigator();

const DrawerStackComponent = memo(function DrawerStackComponent() {
  return (
    <DrawerStack.Navigator
      drawerContent={() => <DrawCustome />}
      initialRouteName="TabNavigation"
      screenOptions={{headerShown: false, drawerType: 'front', swipeEnabled: false}}>
      <DrawerStack.Screen name="HomeScreen" component={HomeScreen} />
    </DrawerStack.Navigator>
  );
});

const MainStackComponent = memo(function MainStackComponent() {
  return (
    <MainStack.Navigator
      initialRouteName="PreloadScreen"
      screenOptions={{headerShown: false}}>
      <RootStack.Screen name="PreloadScreen" component={PreloadScreen} />
      <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <MainStack.Screen name="LoginScreen" component={LoginScreen} />
     <MainStack.Screen name="Draw" component={DrawerStackComponent} />
    </MainStack.Navigator>
  );
});

const Routes = memo(function Routes() {
  const routeNameRef = React.useRef<string>('');
  const onStateChange = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRouteName && previousRouteName !== currentRouteName) {
      // analytics().setCurrentScreen(currentRouteName);
      routeNameRef.current = currentRouteName;
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
      <RootStack.Navigator
        initialRouteName="MainNavigation"
        screenOptions={{headerShown: false}}>
        <RootStack.Screen
          name="MainNavigation"
          component={MainStackComponent}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
});

export default Routes;

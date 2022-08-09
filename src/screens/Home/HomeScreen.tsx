import * as React from 'react';
import {StyleSheet, Dimensions, useWindowDimensions, View} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import styled from 'styled-components/native';
import {Colors} from '@/themes/Colors';

import {HeaderComponent} from '@/components/HeaderComponent';
import {CheckPermissionScreen} from '@/screens/CheckIn/CheckPermissionScreen';

import {HistoryScreen} from '@/screens/History/HistoryScreen';
import {memo, useCallback, useState} from 'react';

const routes = [
  {key: 'first', title: 'CheckIn'},
  {key: 'second', title: 'Lịch sử'},
];

export const HomeScreen = memo(() => {
  const [index, setIndex] = useState(0);

  const _setIndex = useCallback((index: number) => {
    setIndex(index);
  }, []);

  const renderScene = ({route}: any) => {
    switch (route?.key) {
      case 'first':
        return <CheckPermissionScreen index={index} />;
      case 'second':
        return <HistoryScreen />;
      default:
        return null;
    }
  };

  const {width} = useWindowDimensions();

  const renderTabBar = useCallback((props: any) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBar}
        renderLabel={({route, focused}) => (
          <LabelText focused={focused}>{route.title}</LabelText>
        )}
      />
    );
  }, []);

  return (
    <Container>
      <HeaderComponent title="Checkin" />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={_setIndex}
        initialLayout={{width}}
        style={styles.container}
        renderTabBar={renderTabBar}
        lazy
      />
    </Container>
  );
});

const LabelText = styled.Text<{focused?: boolean}>`
  color: ${p => (p.focused ? Colors.azure : Colors.oldSilver)};
  margin: 8px;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
`;

const Container = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },

  indicatorStyle: {
    backgroundColor: Colors.azure,
  },

  tabBar: {
    backgroundColor: Colors.white,
  },
});

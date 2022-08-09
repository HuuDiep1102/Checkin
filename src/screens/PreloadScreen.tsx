import React, {memo, useEffect} from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';
import {IC_BASE_ME} from '@/assets';
import {useClient} from '@/store/login';
import {
  replaceWithMainScreen,
  replaceWithWelcomeScreen,
} from '@/utils/navigation';
import {RawClient} from '@/types';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 142px;
  height: 160px;
`;

export const PreloadScreen = memo(function PreloadScreen() {
  const client: RawClient = useClient();

  useEffect(() => {
    setTimeout(() => {
      if (!!client?.access_token) {
        replaceWithMainScreen();
      } else {
        replaceWithWelcomeScreen();
      }
    }, 2000);
  }, []);

  return (
    <Container>
      <Logo source={IC_BASE_ME} resizeMode={'stretch'} />
      <ActivityIndicator color={'#0077cc'} />
    </Container>
  );
});

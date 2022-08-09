import React, {memo, useCallback} from 'react';

import {IC_LOCK} from '@/assets';

import styled from 'styled-components/native';
import {ScrollView, StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Colors} from '@/themes/Colors';
import {RawClient} from '@/types';
import {useClient} from '@/store/login';
import {requestLogout} from '@/store/login/functions';
import {defaultParams} from '@/utils/formData';
import {reset} from '@/utils/navigation';

export const CustomDrawer = memo(() => {
  const client: RawClient = useClient();

  const onLogout = useCallback(async () => {
    const res = await requestLogout({
      access_token: client.access_token,
      client_key: client.client_key,
      ...defaultParams,
    });

    if (res) {
      reset();
    }
  }, [reset]);
  return (
    <DrawerContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <BannerContainer></BannerContainer>

        <NewCollectionContainer>
          <NewCollectionButton onPress={onLogout}>
            <LogIcon source={IC_LOCK} />
            <NewCollectionButtonText>Logout</NewCollectionButtonText>
          </NewCollectionButton>
        </NewCollectionContainer>
      </ScrollView>
    </DrawerContainer>
  );
});

const DrawerContainer = styled.View`
  flex: 1;
`;

const BannerContainer = styled.View`
  flex-direction: row;
  height: ${44 + getStatusBarHeight()}px;
  padding-top: ${getStatusBarHeight()}px;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
  padding-right: 9px;
`;
const Avatar = styled.Image`
  height: 40px;
  width: 40px;
  border-radius: 45px;
`;

const NewCollectionContainer = styled.View`
  padding-left: 20px;
  background-color: ${Colors.white};
  justify-content: center;
  height: 64px;
`;

const NewCollectionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const LogIcon = styled.Image`
  height: 20px;
  width: 20px;
`;

const NewCollectionButtonText = styled.Text`
  font-size: 15px;
  margin-left: 17px;
  color: ${Colors.black};
`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.azure,
  },
});

export default CustomDrawer;

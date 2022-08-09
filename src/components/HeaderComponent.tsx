import React, {memo} from 'react';
import styled from 'styled-components/native';
import {Colors} from '@/themes/Colors';
import 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {StatusBar} from 'react-native';
import {IC_MENU} from '@/assets';
import {openDrawer} from '@/utils/navigation';

interface HeaderComponentProps {
  title: string;
}
export const HeaderComponent = memo((props: HeaderComponentProps) => {
  const {title} = props;

  return (
    <HeaderContainer>
      <DrawButton onPress={openDrawer}>
        <HeaderImage source={IC_MENU} />
      </DrawButton>
      <StatusBar
        translucent
        backgroundColor={Colors.transparent}
        barStyle={'dark-content'}
      />
      <HeaderText>{title}</HeaderText>
    </HeaderContainer>
  );
});

const HeaderContainer = styled.View`
  height: ${44 + getStatusBarHeight()}px;
  padding-top: ${7 + getStatusBarHeight()}px;
  width: 100%;
  background-color: ${Colors.azure};
  flex-direction: row;
  justify-content: center;
`;

const HeaderText = styled.Text`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 23px;
  color: ${Colors.white};
  text-align: center;
`;

const DrawButton = styled.TouchableOpacity`
  position: absolute;
  left: 10px;
  top: 35px;
`;

const HeaderImage = styled.Image`
  width: 24px;
  height: 24px;
`;

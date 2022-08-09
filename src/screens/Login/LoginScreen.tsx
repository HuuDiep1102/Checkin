import React, {memo, useCallback, useState} from 'react';
import styled from 'styled-components/native';
import {Colors} from '@/themes/Colors';
import {IC_BASE_ME, IC_EMAIL, IC_LOCK, IMG_BANNER} from '@/assets';
import {replaceWithMainScreen} from '@/utils/navigation';
import {
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useAsyncFn} from 'react-use';
import {requestLogin} from '@/store/login/functions';
import {CustomTextInput} from '@/components/TextInput';
import {css} from 'styled-components';

export const LoginScreen = memo(() => {
  const [account, setAccount] = useState({
    email: '',
    password: '',
  });

  const [{loading}, onLogin] = useAsyncFn(async () => {
    if (!account.password || !account.password) {
      Alert.alert('', 'Vui lòng nhập email và mật khẩu', [{text: 'OK'}]);
      return;
    }
    const res = await requestLogin(account.email, account.password);

    if (res === 0) {
      Alert.alert(
        'Không thể đăng nhập',
        'Email hoặc mật khẩu không chính xác',
        [{text: 'OK'}],
      );
    } else {
      replaceWithMainScreen();
    }
  }, [replaceWithMainScreen, account]);

  const onChangeValue = useCallback((keyName: string, value: string) => {
    setAccount(prev => ({
      ...prev,
      [keyName]: value,
    }));
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView>
        <View style={{height: Dimensions.get('screen').height}}>
          <HeaderConatiner>
            <LogoApp source={IC_BASE_ME} />
          </HeaderConatiner>

          <SectionContainer>
            <BannerImage resizeMode={'stretch'} source={IMG_BANNER} />
            <LoginInputContainer>
              <CustomTextInput
                icon={IC_EMAIL}
                label={'Email'}
                keyName={'email'}
                value={account.email}
                keyboardType={'email-address'}
                onChangeValue={onChangeValue}
              />
              <CustomTextInput
                secureTextEntry
                icon={IC_LOCK}
                label={'Mật khẩu'}
                keyName={'password'}
                value={account.password}
                onChangeValue={onChangeValue}
              />

              <ForgotPassWordContainer>
                <ForgotPassWordText>Quên mật khẩu?</ForgotPassWordText>
              </ForgotPassWordContainer>
            </LoginInputContainer>
            <FooterContainer>
              <WrapButton>
                <BtnLogin disabled={loading} onPress={onLogin}>
                  <BtnLoginText>ĐĂNG NHẬP</BtnLoginText>
                  {loading && (
                    <ActivityIndicator
                      color={'#ffffff'}
                      style={{marginLeft: 10}}
                    />
                  )}
                </BtnLogin>
              </WrapButton>
            </FooterContainer>
          </SectionContainer>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
const BannerImage = styled.Image`
  position: absolute;
  ${Platform.select({
    ios: css`
      height: 456.93px;
    `,
    android: css`
      height: 400px;
    `,
  })};
  width: 100%;
  bottom: 0;
  opacity: 0.2;
  z-index: -1;
`;

const SectionContainer = styled.View`
  flex: 2;
`;

const HeaderConatiner = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const LogoApp = styled.Image`
  height: 160px;
  width: 141.21px;
`;

const LoginInputContainer = styled.View`
  ${Platform.select({
    ios: css`
      padding-top: 100px;
    `,
    android: css`
      padding-top: 65px;
    `,
  })};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ForgotPassWordContainer = styled.TouchableOpacity`
  height: 64px;
  width: 150px;
  ${Platform.select({
    ios: css`
      padding-right: 11%;
    `,
    android: css`
      padding-right: 0;
    `,
  })};
  align-self: flex-end;
`;
const ForgotPassWordText = styled.Text`
  height: 64px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  text-decoration-line: underline;
  color: ${Colors.oldSilver};
  text-align: center;
`;

const FooterContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const WrapButton = styled.View`
  padding-bottom: 45px;
`;

const BtnLogin = styled.TouchableOpacity`
  height: 48px;
  width: 300px;
  background-color: ${Colors.azure};
  justify-content: center;
  align-items: center;
  border-radius: 34px;
  border-width: 1px;
  border-color: ${Colors.azure};
  flex-direction: row;
`;

const BtnLoginText = styled.Text`
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: ${Colors.white};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
});

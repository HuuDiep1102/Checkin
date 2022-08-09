import React, {memo} from 'react';
import styled from 'styled-components/native';
import {Colors} from '@/themes/Colors';
import {IC_BASE_ME} from '@/assets';
import {navigateToLoginScreen} from '@/utils/navigation';

export const WelcomeScreen = memo(() => {
  return (
    <WelcomeScreenContainer>
      <HeaderContainer>
        <LogoApp source={IC_BASE_ME} />
      </HeaderContainer>
      <BannerContainer>
        <BannerText>Base Me</BannerText>
        <TitleText>
          {'Giải pháp quản lý thông tin nhân sự \n cho doanh nghiệp 4.0'}
        </TitleText>
      </BannerContainer>
      <FooterContainer>
        <WarningText>Bạn chưa đăng nhập</WarningText>
        <WrapButton>
          <BtnLogin onPress={navigateToLoginScreen}>
            <BtnLoginText>ĐĂNG NHẬP THỦ CÔNG</BtnLoginText>
          </BtnLogin>
        </WrapButton>
      </FooterContainer>
    </WelcomeScreenContainer>
  );
});

const WelcomeScreenContainer = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`;

const HeaderContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const LogoApp = styled.Image`
  height: 160px;
  width: 141.21px;
`;

const BannerContainer = styled.View`
  flex: 1;
`;

const BannerText = styled.Text`
  font-weight: 700;
  font-size: 30px;
  line-height: 35px;
  text-align: center;
  padding-top: 39px;
  padding-bottom: 7px;
  color: ${Colors.azure};
`;

const TitleText = styled.Text`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  color: ${Colors.darkCharcoal};
`;

const FooterContainer = styled.View`
  flex: 1;
  align-items: center;
`;

const WarningText = styled.Text`
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  padding-bottom: 29px;
  padding-top: 80px;
  color: ${Colors.oldSilver};
`;

const WrapButton = styled.View``;

const BtnLogin = styled.TouchableOpacity`
  height: 48px;
  width: 300px;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border-width: 1px;
  border-color: ${Colors.azure};
`;

const BtnLoginText = styled.Text`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: ${Colors.azure};
`;

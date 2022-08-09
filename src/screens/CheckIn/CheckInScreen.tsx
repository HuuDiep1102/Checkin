import React, { memo, useCallback, useMemo, useRef } from "react";
import styled from "styled-components/native";
import { Maps } from "@/screens/CheckIn/components/Map";
import { Colors } from "@/themes/Colors";
import moment from "moment";
import "moment/locale/vi"; // ko co dong nay locale ko chay
import CameraView from "@/screens/CheckIn/components/Camera";
import { MobileClient, RawClient } from "@/types";
import { useClient } from "@/store/login";
import { useAsyncFn } from "react-use";
import { useLocation } from "@/hooks/useLocation";
import { defaultParams } from "@/utils/formData";
import { requestCheckin } from "@/store/login/functions";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { Marker } from "react-native-maps";
import { css } from "styled-components";
import { Timer } from "@/screens/CheckIn/components/Timer";
import useBoolean from "@/hooks/useBoolean";
import { ModalClient } from "@/screens/CheckIn/components/ModalClient";

interface Props {
  selectedClient?: MobileClient;
  setSelectedClient: Function;
  index?: number;
}

export const CheckInScreen = memo(
  ({selectedClient, setSelectedClient, index}: Props) => {
    const [modalVisible, showModalVisible, hideModalVisible] =
      useBoolean(false);

    const weekName = useMemo(() => {
      return moment().locale('vi').format('dddd');
    }, []);

    const today = useMemo(() => {
      return moment().format('L');
    }, []);

    const onSelectClient = useCallback(() => {
      showModalVisible();
    }, []);

    const client: RawClient = useClient();

    const cameraRef = useRef<any>(null);

    const {latitude, longitude} = useLocation();

    const initialRegion = useMemo(() => {
      return latitude && longitude
        ? {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
        : undefined;
    }, [latitude, longitude]);

    const coordinate = useMemo(() => {
      return latitude && longitude
        ? {
            latitude,
            longitude,
          }
        : undefined;
    }, [latitude, longitude]);

    const [{loading}, submitCheckin] = useAsyncFn(async () => {
      if (!cameraRef?.current || !latitude || !longitude || !selectedClient) {
        return null;
      }

      const photo = await cameraRef?.current.takePhoto({
        flash: 'off',
      });

      const ts = moment().unix() / 1000;
      const params = {
        access_token: client.access_token,
        client_key: client.client_key,
        lat: latitude,
        lng: longitude,
        client_id: selectedClient.id,
        photo: photo.path,
        ts,
        ...defaultParams,
      };

      const res = await requestCheckin(params);

      Alert.alert(
        '',
        res
          ? 'CheckIn thành công'
          : 'CheckIn không thành công, hãy vui lòng thử lại',
        [{text: 'OK'}],
      );
    }, [latitude, longitude]);

    return (
      <Container>
        <ModalClient
          setSelectedClient={setSelectedClient}
          modalVisible={modalVisible}
          hideModalVisible={hideModalVisible}
        />

        <DateTimeContainer>
          <Date>
            {weekName}, {today}
          </Date>
          <Timer />
        </DateTimeContainer>
        <Maps initialRegion={initialRegion}>
          {coordinate && <Marker coordinate={coordinate} />}
        </Maps>
        {index === 0 && <CameraView ref={cameraRef} />}
        <ButtonContainer>
          <CheckInButton disabled={loading} onPress={submitCheckin}>
            <CheckInButtonText>CHẤM CÔNG</CheckInButtonText>
            {loading && <ActivityIndicator color={Colors.blues} />}
          </CheckInButton>
          <CheckInClientContainer onPress={onSelectClient}>
            <CheckInClientText numberOfLines={1}>
              {selectedClient?.name}
            </CheckInClientText>
          </CheckInClientContainer>
        </ButtonContainer>
      </Container>
    );
  },
);

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.white};
  margin-top: 8px;
`;

const DateTimeContainer = styled.View`
  flex: 1;
  align-items: center;
  ${Platform.select({
    ios: css`
      padding-top: 30px;
    `,
    android: css`
      padding-top: 10px;
    `,
  })};
  ${Platform.select({
    ios: css`
      margin-bottom: 0;
    `,
    android: css`
      margin-bottom: 20px;
    `,
  })};
`;

const Date = styled.Text`
  font-size: 25px;
  font-weight: 500;
  text-transform: capitalize;
  color: ${Colors.black};
`;

const ButtonContainer = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  ${Platform.select({
    ios: css`
      margin-top: 10px;
    `,
    android: css`
      margin-top: 20px;
    `,
  })};
`;

const CheckInButton = styled.TouchableOpacity`
  height: 55px;
  width: 76%;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border-color: ${Colors.green2};
  border-width: 0.5px;
  margin-bottom: 15px;
  flex-direction: row;
`;

const CheckInButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.green2};
  font-weight: 500;
`;

const CheckInClientContainer = styled.TouchableOpacity`
  height: 30px;
  width: 44%;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: antiquewhite;
`;

const CheckInClientText = styled.Text`
  font-size: 13px;
  color: ${Colors.green2};
  font-weight: 400;
`;

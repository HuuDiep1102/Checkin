import React, {memo, useCallback, useMemo, useRef} from 'react';
import styled from 'styled-components/native';
import {Maps} from '@/screens/CheckIn/components/Map';
import {Colors} from '@/themes/Colors';
import moment from 'moment';
import 'moment/locale/vi'; // ko co dong nay locale ko chay
import CameraView from '@/screens/CheckIn/components/Camera';
import {MobileClient, RawClient} from '@/types';
import {useClient, useMobileClients} from '@/store/login';
import {useAsyncFn} from 'react-use';
import {useLocation} from '@/hooks/useLocation';
import {defaultParams} from '@/utils/formData';
import {requestCheckin} from '@/store/login/functions';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Marker} from 'react-native-maps';
import {css} from 'styled-components';
import {Timer} from '@/screens/CheckIn/components/Timer';
import Modal from 'react-native-modal';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import useBoolean from '@/hooks/useBoolean';

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

    const onBackdrop = useCallback(() => {
      hideModalVisible();
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

    const mobileClients: MobileClient[] = useMobileClients();

    const onPickClient = useCallback(
      (item: MobileClient) => {
        setSelectedClient(item);
        hideModalVisible();
      },
      [setSelectedClient],
    );

    return (
      <Container>
        <Modal
          style={styles.modal}
          isVisible={modalVisible}
          hasBackdrop={true}
          statusBarTranslucent={true}
          onBackdropPress={onBackdrop}>
          <CenteredView>
            <ModalView>
              <InputContactContainer>
                <NoteSelectContainer>
                  <NoteText>Select CheckIn client</NoteText>
                </NoteSelectContainer>
                <ScrollView>
                  {mobileClients.length > 0 &&
                    mobileClients.map((item, index) => {
                      return (
                        <SelectButton
                          key={index}
                          onPress={() => onPickClient(item)}>
                          <TitleText numberOfLines={1}>{item.name}</TitleText>
                        </SelectButton>
                      );
                    })}
                </ScrollView>
              </InputContactContainer>
            </ModalView>
          </CenteredView>
        </Modal>

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
            {loading && <ActivityIndicator color={'#0077cc'} />}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },

  checkIn: {
    backgroundColor: Colors.white,
    marginTop: 8,
  },

  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
});

const NoteSelectContainer = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: ${Colors.oldSilver};
  height: 40px;
  justify-content: center;
`;

const NoteText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
  color: ${Colors.black};
`;

const TitleText = styled.Text`
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
  color: ${Colors.black};
`;

const CenteredView = styled.View`
  align-items: center;
  padding: 0 20px;
  padding-bottom: ${getBottomSpace()}px;
  background-color: ${Colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const ModalView = styled.View`
  width: 110%;
  background-color: ${Colors.white};
  border-radius: 20px;
  padding-top: 10px;
  padding-left: 20px;
`;

const InputContactContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: 15px;
  padding: 5px;
`;

const SelectButton = styled.TouchableOpacity`
  height: 40px;
  padding-top: 10px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${Colors.oldSilver};
`;

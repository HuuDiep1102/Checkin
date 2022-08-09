import {StyleSheet, View, ScrollView} from 'react-native';
import {SelectItem} from '@/components/SelectItem';
import {IC_CAMERA, IC_CHECKIN, IC_LOCATION} from '@/assets';
import * as React from 'react';
import styled from 'styled-components/native';
import {Colors} from '@/themes/Colors';
import {memo, useCallback, useEffect, useState} from 'react';
import {checkPermission, PERMISSIONS_TYPE} from '@/utils/permissions';
import {CheckInScreen} from '@/screens/CheckIn/CheckInScreen';
import Modal from 'react-native-modal';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {
  MobileClient,
  PayloadPostClientsProps,
  Permission,
  RawClient,
} from '@/types';
import {useClient, useMobileClients} from '@/store/login';
import {useAsyncFn} from 'react-use';
import {defaultParams} from '@/utils/formData';
import {getClients} from '@/store/login/functions';
import useBoolean from '@/hooks/useBoolean';

interface Props {
  index?: number;
}

export const CheckPermissionScreen = memo(({index}: Props) => {
  const [permission, setPermission] = useState<Permission>({
    checkin: false,
    camera: false,
    location: false,
  });

  const [isCheckIn, setCheckIn] = useState(false);

  const [modalVisible, showModalVisible, hideModalVisible] = useBoolean(false);

  const client: RawClient = useClient();

  const [{}, getMobileClients] = useAsyncFn(async () => {
    if (!client.access_token || !client.client_key) {
      return null;
    }

    const payload: PayloadPostClientsProps = {
      lat: 112,
      lng: 111,
      access_token: client.access_token,
      client_key: client.client_key,
      ...defaultParams,
    };

    await getClients(payload);
  }, [client]);

  useEffect(() => {
    getMobileClients().then();
  }, []);

  const mobileClients: MobileClient[] = useMobileClients();

  const [selectedClient, setSelectedClient] = useState<MobileClient>();

  const onBackdrop = useCallback(() => {
    hideModalVisible();
  }, []);

  const onSelectClient = useCallback(() => {
    showModalVisible();
  }, []);

  const onPermission = useCallback(
    async (type: string, isRequest?: boolean) => {
      const _permission = await checkPermission(type, isRequest);
      setPermission((prev: any) => ({
        ...prev,
        [type]: _permission,
      }));
    },
    [],
  );

  const onRequestCamera = useCallback(async () => {
    await onPermission(PERMISSIONS_TYPE.camera, true);
  }, [PERMISSIONS_TYPE.camera]);

  const onRequestLocation = useCallback(async () => {
    await onPermission(PERMISSIONS_TYPE.location, true);
  }, [PERMISSIONS_TYPE.location]);

  const onPickClient = useCallback(
    (item: MobileClient) => {
      setPermission((prev: any) => ({
        ...prev,
        checkin: true,
      }));
      setSelectedClient(item);
      hideModalVisible();
    },
    [setSelectedClient, permission.checkin],
  );

  useEffect(() => {
    (async () => {
      await onPermission(PERMISSIONS_TYPE.camera);
      await onPermission(PERMISSIONS_TYPE.location);
    })();
  }, []);

  useEffect(() => {
    setCheckIn(permission.checkin && permission.camera && permission.location);
  }, [permission.checkin, permission.camera, permission.location]);

  return (
    <View style={[styles.scene, styles.checkIn]}>
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
      {isCheckIn ? (
        <CheckInScreen
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          index={index}
        />
      ) : (
        <>
          <NoteContainer>
            <TextNote>
              {
                'Để có thể sử dụng tính năng CheckIn bạn vui lòng\nchọn thao tác Anable/disable'
              }
            </TextNote>
          </NoteContainer>
          <SelectContainer>
            <SelectItem
              title="CheckIn client"
              icon={IC_CHECKIN}
              clientCheckIn={selectedClient}
              onPress={onSelectClient}
              active={permission.checkin}
            />
            <SelectItem
              title="Camera"
              icon={IC_CAMERA}
              onPress={onRequestCamera}
              active={permission.camera}
            />

            <SelectItem
              title="Location"
              icon={IC_LOCATION}
              onPress={onRequestLocation}
              active={permission.location}
            />
          </SelectContainer>
        </>
      )}
    </View>
  );
});

const NoteContainer = styled.View`
  height: 64px;
  justify-content: center;
`;

const TextNote = styled.Text`
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  padding-left: 16px;
  color: ${Colors.oldSilver};
`;

const SelectContainer = styled.View`
  flex: 1;
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

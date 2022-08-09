import { StyleSheet, View } from "react-native";
import { SelectItem } from "@/components/SelectItem";
import { IC_CAMERA, IC_CHECKIN, IC_LOCATION } from "@/assets";
import * as React from "react";
import { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Colors } from "@/themes/Colors";
import { checkPermission, PERMISSIONS_TYPE } from "@/utils/permissions";
import { CheckInScreen } from "@/screens/CheckIn/CheckInScreen";
import { MobileClient, PayloadPostClientsProps, Permission, RawClient } from "@/types";
import { useClient } from "@/store/login";
import { useAsyncFn } from "react-use";
import { defaultParams } from "@/utils/formData";
import { getClients } from "@/store/login/functions";
import useBoolean from "@/hooks/useBoolean";
import { ModalClient } from "@/screens/CheckIn/components/ModalClient";

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

  const [selectedClient, setSelectedClient] = useState<MobileClient>();

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
      <ModalClient
        setSelectedClient={setSelectedClient}
        permission={permission}
        setPermission={setPermission}
        modalVisible={modalVisible}
        hideModalVisible={hideModalVisible}
      />
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

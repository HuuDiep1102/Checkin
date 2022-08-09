import React, {useCallback} from 'react';
import {Colors} from '@/themes/Colors';
import styled from 'styled-components/native';
import {ScrollView, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {MobileClient} from '@/types';
import {useMobileClients} from '@/store/login';

interface Props {
  setSelectedClient: Function;
  permission?: any;
  setPermission?: Function;
  modalVisible: boolean;
  hideModalVisible: Function;
}

export const ModalClient = ({
  setSelectedClient,
  permission,
  setPermission,
  modalVisible,
  hideModalVisible,
}: Props) => {
  const mobileClients: MobileClient[] = useMobileClients();

  const onBackdrop = useCallback(() => {
    hideModalVisible();
  }, []);

  const onPickClient = useCallback(
    (item: MobileClient) => {
      setPermission &&
        setPermission((prev: any) => ({
          ...prev,
          checkin: true,
        }));
      setSelectedClient(item);
      hideModalVisible();
    },
    [setSelectedClient, permission?.checkin],
  );

  return (
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
  );
};

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

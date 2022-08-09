import React, {forwardRef, useEffect, useMemo} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Colors} from '@/themes/Colors';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';

const LoadingView = styled.View`
  width: 80%;
  height: 240px;
  align-self: center;
  background-color: ${Colors.yellowOrange};
  margin-bottom: 5px;
`;

const CameraView = (props: any, ref: any) => {
  const devices = useCameraDevices();

  // const device = useMemo(() => {
  //   return devices.front;
  // }, [devices]);

  const device = devices.front;

  if (!device) {
    return <LoadingView />;
  }

  return (
    <Camera ref={ref} device={device} isActive photo style={styles.camera} />
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 140,
    width: '80%',
  },
});

export default forwardRef(CameraView);

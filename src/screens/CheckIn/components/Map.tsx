import MapView, {MapViewProps, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from '@/themes/Colors';
import styled from 'styled-components/native'; // remove PROVIDER_GOOGLE import if not using Google Maps

const LoadingView = styled.View`
  height: 18%;
  width: 80%;
  background-color: ${Colors.oldSilver};
  align-self: center;
  margin-bottom: 8px;
`;

export const Maps = (props: MapViewProps) => {
  const {initialRegion, children} = props;

  if (!initialRegion) {
    return <LoadingView />;
  }

  return (
    <MapContainer>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        {...props}>
        {children}
      </MapView>
    </MapContainer>
  );
};

const MapContainer = styled.View`
  justify-content: flex-start;
  height: 18%;
  width: 80%;
  align-self: center;
  margin-bottom: 8px;
`;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

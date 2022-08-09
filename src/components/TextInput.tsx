import React, {memo, useCallback} from 'react';
import {Colors} from '@/themes/Colors';
import styled from 'styled-components/native';
import {ImageSourcePropType, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  icon: ImageSourcePropType;
  label: string;
  onChangeValue: (keyName: string, value: string) => void;
  keyName: string;
}

export const CustomTextInput = memo((props: Props) => {
  const {icon, label, onChangeValue, keyName} = props;

  const onChange = useCallback(
    (text: string) => {
      onChangeValue(keyName, text);
    },
    [keyName, onChangeValue],
  );

  return (
    <TextInputContainer>
      <Icon source={icon} resizeMode={'stretch'} />
      <TextInput
        placeholder={label}
        placeholderTextColor={Colors.oldSilver}
        onChangeText={onChange}
        {...props}
      />
    </TextInputContainer>
  );
});

const TextInputContainer = styled.View`
  flex-direction: row;
  height: 44px;
  border-bottom-color: ${Colors.gray};
  border-bottom-width: 0.5px;
  align-items: center;
  margin-bottom: 26px;
  width: 80%;
`;
const Icon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  margin-top: 4px;
`;
const TextInput = styled.TextInput`
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: -0.24px;
  flex: 1;
  height: 44px;
  color: ${Colors.black};
`;

import React, {memo, useEffect, useState} from 'react';
import {Colors} from '@/themes/Colors';
import styled from 'styled-components/native';
import moment from 'moment';

export const Timer = memo(() => {
  const [time, setTime] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format('HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Time>{time}</Time>;
});

const Time = styled.Text`
  font-size: 45px;
  color: ${Colors.azure};
  font-weight: 600;
  padding-top: 10px;
`;

import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import moment from 'moment';
import {Colors} from '@/themes/Colors';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {DayComponent} from '@/screens/History/components/DayComponent';
import {RawClient} from '@/types';
import {useClient} from '@/store/login';
import {useAsyncFn} from 'react-use';
import {defaultParams} from '@/utils/formData';
import {requestGetHistory} from '@/store/history/function';
import {HeaderCalendar} from '@/screens/History/components/HeaderCalendar';
import {DayProps} from 'react-native-calendars/src/calendar/day';
import styled from 'styled-components/native';
LocaleConfig.locales['vn'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  dayNames: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  dayNamesShort: ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
};

LocaleConfig.defaultLocale = 'vn';

const themes: any = {
  textSectionTitleColor: Colors.black,
  arrowColor: Colors.oldSilver,
  weekVerticalMargin: 0,
  textDayHeaderFontSize: 13,
  textDayHeaderFontWeight: '400',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  'stylesheet.calendar.header': {
    week: {
      flexDirection: 'row',
      width: '100%',
      height: 50,
      borderBottomWidth: 0.25,
      borderBottomColor: Colors.black10,
      backgroundColor: Colors.anti_flashWhite,
      justifyContent: 'space-around', //fix around over day components
    },
    dayHeader: {
      paddingTop: 17,
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '400',
      color: Colors.black,
      flex: 1,
      borderWidth: 0.25,
      borderColor: Colors.gray2,
    },
  },
};

const BlankView = styled.View`
  width: 100%;
  height: 8px;
  background-color: ${Colors.anti_flashWhite};
`;

export const HistoryScreen = memo(() => {
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );

  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);

  const client: RawClient = useClient();

  const [{loading}, getHistory] = useAsyncFn(async () => {
    if (!client.access_token || !client.client_key) {
      return null;
    }

    const time_start = moment(selectedDate).startOf('month').valueOf() / 1000;

    const time_end = moment(selectedDate).endOf('month').valueOf() / 1000;

    const payload = {
      access_token: client.access_token,
      client_key: client.client_key,
      time_start: time_start,
      time_end: time_end,
      client_id: 658,
      ...defaultParams,
    };
    await requestGetHistory(payload);
  }, [client, selectedDate]);

  useEffect(() => {
    getHistory().then();
  }, [selectedDate]);

  const renderHeader = useCallback((date?: any) => {
    return <HeaderCalendar date={date} />;
  }, []);

  const renderDayComponent = useCallback(
    (
      date?: DayProps & {
        date?: DateData;
      },
    ) => {
      if (!date) {
        return <View />;
      }

      const dateString = useMemo(() => {
        return date.date?.dateString;
      }, [date]);

      const isDayInMonth = useMemo(() => {
        return selectedMonth === date?.date?.month;
      }, [date, selectedMonth]);

      const isToday = useMemo(() => {
        return dateString === moment().format('YYYY-MM-DD');
      }, [dateString]);

      return (
        <DayComponent
          key={dateString}
          isToday={isToday}
          date={dateString}
          isDayInMonth={isDayInMonth}
        />
      );
    },
    [selectedMonth],
  );

  const onPressArrowRight = useCallback((addMonth: () => void) => {
    addMonth();
    setSelectedMonth(prev => prev + 1);
  }, []);

  const onPressArrowLeft = useCallback((subtractMonth: () => void) => {
    subtractMonth();
    setSelectedMonth(prev => prev - 1);
  }, []);

  const onMonthChange = useCallback((date: DateData) => {
    setSelectedDate(date.dateString);
  }, []);

  return (
    <View style={[styles.scene, styles.history]}>
      <BlankView />
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getHistory} />
        }>
        <Calendar
          style={styles.calendar}
          monthFormat={'yyyy MM dd'}
          onMonthChange={onMonthChange}
          disableMonthChange={true}
          firstDay={1}
          onPressArrowLeft={onPressArrowLeft}
          onPressArrowRight={onPressArrowRight}
          renderHeader={renderHeader}
          dayComponent={renderDayComponent}
          theme={themes}
          disableAllTouchEventsForDisabledDays={true}
          disableAllTouchEventsForInactiveDays
        />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
    height: '100%',
  },

  history: {
    backgroundColor: Colors.white,
  },

  scene: {
    flex: 1,
    backgroundColor: Colors.black,
  },

  scroll: {},
});

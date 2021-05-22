import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GENERAL_STYLES from '../../../constants/Styles';
import i18n from 'i18n-js';

type Props = {
  time: number;
  level: number;
};

const styles = StyleSheet.create({
  centerSmallMargin: {
    ...GENERAL_STYLES.centerHorizontal,
    marginBottom: 5,
  },
  centerBigMargin: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusIcon: {
    marginLeft: 5,
  },
});

function getFormattedTime(seconds: number): string {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(seconds);
  let format;
  if (date.getHours()) {
    format = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  } else if (date.getMinutes()) {
    format = `${date.getMinutes()}:${date.getSeconds()}`;
  } else {
    format = date.getSeconds().toString();
  }
  return format;
}

function GameStatus(props: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        ...GENERAL_STYLES.flex,
        ...GENERAL_STYLES.centerVertical,
      }}
    >
      <View style={GENERAL_STYLES.centerHorizontal}>
        <Caption style={styles.centerSmallMargin}>
          {i18n.t('screens.game.time')}
        </Caption>
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name={'timer'}
            color={theme.colors.subtitle}
            size={20}
          />
          <Text
            style={{
              ...styles.statusIcon,
              color: theme.colors.subtitle,
            }}
          >
            {getFormattedTime(props.time)}
          </Text>
        </View>
      </View>
      <View style={styles.centerBigMargin}>
        <Caption style={styles.centerSmallMargin}>
          {i18n.t('screens.game.level')}
        </Caption>
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name={'gamepad-square'}
            color={theme.colors.text}
            size={20}
          />
          <Text style={styles.statusIcon}>{props.level}</Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(
  GameStatus,
  (pp, np) => pp.level === np.level && pp.time === np.time
);

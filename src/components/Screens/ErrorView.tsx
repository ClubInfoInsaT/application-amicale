/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';
import { Button, Subheading, useTheme } from 'react-native-paper';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {
  API_REQUEST_CODES,
  getErrorMessage,
  REQUEST_STATUS,
} from '../../utils/Requests';

export type ErrorProps = {
  status?: REQUEST_STATUS;
  code?: API_REQUEST_CODES;
  icon?: string;
  message?: string;
  loading?: boolean;
  button?: {
    text: string;
    icon: string;
    onPress: () => void;
  };
  style?: ViewStyle;
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  inner: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  iconContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  subheading: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

function ErrorView(props: ErrorProps) {
  const theme = useTheme();
  const fullMessage = getErrorMessage(props, props.message, props.icon);
  const { button } = props;

  return (
    <View style={{ ...styles.outer, ...props.style }}>
      <Animatable.View
        style={{
          ...styles.outer,
          backgroundColor: theme.colors.background,
        }}
        animation="zoomIn"
        duration={200}
        useNativeDriver
      >
        <View style={styles.inner}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={fullMessage.icon}
              size={150}
              color={theme.colors.disabled}
            />
          </View>
          <Subheading
            style={{
              ...styles.subheading,
              color: theme.colors.disabled,
            }}
          >
            {fullMessage.message}
          </Subheading>
          {button ? (
            <Button
              mode={'contained'}
              icon={button.icon}
              onPress={button.onPress}
              style={styles.button}
            >
              {button.text}
            </Button>
          ) : null}
        </View>
      </Animatable.View>
    </View>
  );
}

export default ErrorView;

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
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18n-js';
import * as Animatable from 'react-native-animatable';
import { REQUEST_CODES, REQUEST_STATUS } from '../../utils/Requests';

type Props = {
  status?: REQUEST_STATUS;
  code?: REQUEST_CODES;
  icon?: string;
  message?: string;
  loading?: boolean;
  button?: {
    text: string;
    icon: string;
    onPress: () => void;
  };
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

function getMessage(props: Props) {
  let fullMessage = {
    message: '',
    icon: '',
  };
  if (props.code === undefined) {
    switch (props.status) {
      case REQUEST_STATUS.BAD_INPUT:
        fullMessage.message = i18n.t('errors.badInput');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case REQUEST_STATUS.FORBIDDEN:
        fullMessage.message = i18n.t('errors.forbidden');
        fullMessage.icon = 'lock';
        break;
      case REQUEST_STATUS.CONNECTION_ERROR:
        fullMessage.message = i18n.t('errors.connectionError');
        fullMessage.icon = 'access-point-network-off';
        break;
      case REQUEST_STATUS.SERVER_ERROR:
        fullMessage.message = i18n.t('errors.serverError');
        fullMessage.icon = 'server-network-off';
        break;
      default:
        fullMessage.message = i18n.t('errors.unknown');
        fullMessage.icon = 'alert-circle-outline';
        break;
    }
  } else {
    switch (props.code) {
      case REQUEST_CODES.BAD_CREDENTIALS:
        fullMessage.message = i18n.t('errors.badCredentials');
        fullMessage.icon = 'account-alert-outline';
        break;
      case REQUEST_CODES.BAD_TOKEN:
        fullMessage.message = i18n.t('errors.badToken');
        fullMessage.icon = 'account-alert-outline';
        break;
      case REQUEST_CODES.NO_CONSENT:
        fullMessage.message = i18n.t('errors.noConsent');
        fullMessage.icon = 'account-remove-outline';
        break;
      case REQUEST_CODES.TOKEN_SAVE:
        fullMessage.message = i18n.t('errors.tokenSave');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case REQUEST_CODES.BAD_INPUT:
        fullMessage.message = i18n.t('errors.badInput');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case REQUEST_CODES.FORBIDDEN:
        fullMessage.message = i18n.t('errors.forbidden');
        fullMessage.icon = 'lock';
        break;
      case REQUEST_CODES.CONNECTION_ERROR:
        fullMessage.message = i18n.t('errors.connectionError');
        fullMessage.icon = 'access-point-network-off';
        break;
      case REQUEST_CODES.SERVER_ERROR:
        fullMessage.message = i18n.t('errors.serverError');
        fullMessage.icon = 'server-network-off';
        break;
      default:
        fullMessage.message = i18n.t('errors.unknown');
        fullMessage.icon = 'alert-circle-outline';
        break;
    }
  }

  fullMessage.message += `\n\nCode {${props.status}:${props.code}}`;
  if (props.message != null) {
    fullMessage.message = props.message;
  }
  if (props.icon != null) {
    fullMessage.icon = props.icon;
  }
  return fullMessage;
}

function ErrorView(props: Props) {
  const theme = useTheme();
  const fullMessage = getMessage(props);
  const { button } = props;

  return (
    <View style={styles.outer}>
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

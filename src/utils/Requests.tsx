import i18n from 'i18n-js';
import { ApiRejectType } from './WebData';

export enum REQUEST_STATUS {
  SUCCESS = 200,
  TOKEN_SAVE = 4,
  TOKEN_RETRIEVE = 5,
  BAD_INPUT = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONNECTION_ERROR = 600,
  SERVER_ERROR = 500,
  UNKNOWN = 999,
}

export enum API_REQUEST_CODES {
  SUCCESS = 0,
  BAD_CREDENTIALS = 1,
  BAD_TOKEN = 2,
  NO_CONSENT = 3,
  BAD_INPUT = 400,
  FORBIDDEN = 403,
  UNKNOWN = 999,
  SERVER_ERROR = 500,
  CONNECTION_ERROR = 600,
}

export function getErrorMessage(
  props: Partial<ApiRejectType>,
  message?: string,
  icon?: string
) {
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
      case REQUEST_STATUS.TOKEN_SAVE:
        fullMessage.message = i18n.t('errors.tokenSave');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case REQUEST_STATUS.TOKEN_RETRIEVE:
        fullMessage.message = i18n.t('errors.tokenRetrieve');
        fullMessage.icon = 'alert-circle-outline';
        break;
      default:
        fullMessage.message = i18n.t('errors.unknown');
        fullMessage.icon = 'alert-circle-outline';
        break;
    }
  } else {
    switch (props.code) {
      case API_REQUEST_CODES.BAD_CREDENTIALS:
        fullMessage.message = i18n.t('errors.badCredentials');
        fullMessage.icon = 'account-alert-outline';
        break;
      case API_REQUEST_CODES.BAD_TOKEN:
        fullMessage.message = i18n.t('errors.badToken');
        fullMessage.icon = 'account-alert-outline';
        break;
      case API_REQUEST_CODES.NO_CONSENT:
        fullMessage.message = i18n.t('errors.noConsent');
        fullMessage.icon = 'account-remove-outline';
        break;
      case API_REQUEST_CODES.BAD_INPUT:
        fullMessage.message = i18n.t('errors.badInput');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case API_REQUEST_CODES.FORBIDDEN:
        fullMessage.message = i18n.t('errors.forbidden');
        fullMessage.icon = 'lock';
        break;
      default:
        fullMessage.message = i18n.t('errors.unknown');
        fullMessage.icon = 'alert-circle-outline';
        break;
    }
  }

  if (props.code !== undefined) {
    fullMessage.message += `\n\nCode {${props.status}:${props.code}}`;
  } else {
    fullMessage.message += `\n\nCode {${props.status}}`;
  }
  if (message) {
    fullMessage.message = message;
  }
  if (icon) {
    fullMessage.icon = icon;
  }
  return fullMessage;
}

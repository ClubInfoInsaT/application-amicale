import i18n from 'i18n-js';
import { ApiRejectType } from './WebData';

// HTTP status codes used by API
export enum RESPONSE_HTTP_STATUS {
  SUCCESS = 200,
  BAD_INPUT = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  CONNECTION_ERROR = 600, // Custom status code for connection errors
  UNKNOWN = 999, // Custom status code for unknown errors
}

// Codes contained in `code` field of API response
export enum API_RESPONSE_CODE {
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
      case RESPONSE_HTTP_STATUS.BAD_INPUT:
        fullMessage.message = i18n.t('errors.badInput');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case RESPONSE_HTTP_STATUS.FORBIDDEN:
        fullMessage.message = i18n.t('errors.forbidden');
        fullMessage.icon = 'lock';
        break;
      case RESPONSE_HTTP_STATUS.CONNECTION_ERROR:
        fullMessage.message = i18n.t('errors.connectionError');
        fullMessage.icon = 'access-point-network-off';
        break;
      // TODO 404, 600
      case RESPONSE_HTTP_STATUS.SERVER_ERROR:
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
      case API_RESPONSE_CODE.BAD_CREDENTIALS:
        fullMessage.message = i18n.t('errors.badCredentials');
        fullMessage.icon = 'account-alert-outline';
        break;
      case API_RESPONSE_CODE.BAD_TOKEN:
        fullMessage.message = i18n.t('errors.badToken');
        fullMessage.icon = 'account-alert-outline';
        break;
      case API_RESPONSE_CODE.NO_CONSENT:
        fullMessage.message = i18n.t('errors.noConsent');
        fullMessage.icon = 'account-remove-outline';
        break;
      case API_RESPONSE_CODE.BAD_INPUT:
        fullMessage.message = i18n.t('errors.badInput');
        fullMessage.icon = 'alert-circle-outline';
        break;
      case API_RESPONSE_CODE.FORBIDDEN:
        fullMessage.message = i18n.t('errors.forbidden');
        fullMessage.icon = 'lock';
        break;
      case API_RESPONSE_CODE.SERVER_ERROR:
        fullMessage.message = i18n.t('errors.serverError');
        fullMessage.icon = 'server-network-off';
        break;
      default:
        fullMessage.message = i18n.t('errors.unknown');
        fullMessage.icon = 'alert-circle-outline';
        break;
    }
  }

  // Fix this up
  if (props.code !== undefined) {
    fullMessage.message += `\n\nCode {${props.status}:${props.code}}`;
  } else {
    fullMessage.message += `\n\nCode {${props.status}}`;
  }
  if (props.message) {
    fullMessage.message += `\n\n"${props.message}"`;
  }
  if (message) {
    fullMessage.message = message;
  }
  if (icon) {
    fullMessage.icon = icon;
  }
  return fullMessage;
}

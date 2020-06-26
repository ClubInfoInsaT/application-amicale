// @flow

import * as React from 'react';
import i18n from "i18n-js";
import {ERROR_TYPE} from "../../utils/WebData";
import AlertDialog from "./AlertDialog";

type Props = {
    visible: boolean,
    onDismiss: () => void,
    errorCode: number,
}

class ErrorDialog extends React.PureComponent<Props> {

    title: string;
    message: string;

    generateMessage() {
        this.title = i18n.t("errors.title");
        switch (this.props.errorCode) {
            case ERROR_TYPE.BAD_CREDENTIALS:
                this.message = i18n.t("errors.badCredentials");
                break;
            case ERROR_TYPE.BAD_TOKEN:
                this.message = i18n.t("errors.badToken");
                break;
            case ERROR_TYPE.NO_CONSENT:
                this.message = i18n.t("errors.noConsent");
                break;
            case ERROR_TYPE.TOKEN_SAVE:
                this.message = i18n.t("errors.tokenSave");
                break;
            case ERROR_TYPE.TOKEN_RETRIEVE:
                this.message = i18n.t("errors.unknown");
                break;
            case ERROR_TYPE.BAD_INPUT:
                this.message = i18n.t("errors.badInput");
                break;
            case ERROR_TYPE.FORBIDDEN:
                this.message = i18n.t("errors.forbidden");
                break;
            case ERROR_TYPE.CONNECTION_ERROR:
                this.message = i18n.t("errors.connectionError");
                break;
            case ERROR_TYPE.SERVER_ERROR:
                this.message = i18n.t("errors.serverError");
                break;
            default:
                this.message = i18n.t("errors.unknown");
                break;
        }
        this.message += "\n\nCode " + this.props.errorCode;
    }

    render() {
        this.generateMessage();
        return (
            <AlertDialog {...this.props} title={this.title} message={this.message}/>
        );
    }
}

export default ErrorDialog;

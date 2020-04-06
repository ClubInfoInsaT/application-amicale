import * as React from 'react';
import i18n from "i18n-js";
import {ERROR_TYPE} from "../../managers/ConnectionManager";
import AlertDialog from "./AlertDialog";

type Props = {
    visible: boolean,
    onDismiss: Function,
    errorCode: number,
}

class ErrorDialog extends React.PureComponent<Props> {

    title: string;
    message: string;

    generateMessage() {
        this.title = i18n.t("loginScreen.errors.title");
        switch (this.props.errorCode) {
            case ERROR_TYPE.BAD_CREDENTIALS:
                this.message = i18n.t("loginScreen.errors.credentials");
                break;
            case ERROR_TYPE.NO_CONSENT:
                this.message = i18n.t("loginScreen.errors.consent");
                break;
            case ERROR_TYPE.CONNECTION_ERROR:
                this.message = i18n.t("loginScreen.errors.connection");
                break;
            case ERROR_TYPE.SERVER_ERROR:
                this.message = "SERVER ERROR"; // TODO translate
                break;
            default:
                this.message = i18n.t("loginScreen.errors.unknown");
                break;
        }
    }

    render() {
        this.generateMessage();
        return (
            <AlertDialog {...this.props} title={this.title} message={this.message}/>
        );
    }
}

export default ErrorDialog;

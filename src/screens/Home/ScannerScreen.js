// @flow

import * as React from 'react';
import {Linking, Platform, StyleSheet, View} from "react-native";
import {Button, Text, withTheme} from 'react-native-paper';
import {RNCamera} from 'react-native-camera';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import URLHandler from "../../utils/URLHandler";
import AlertDialog from "../../components/Dialogs/AlertDialog";
import i18n from 'i18n-js';
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import LoadingConfirmDialog from "../../components/Dialogs/LoadingConfirmDialog";
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

type Props = {};
type State = {
    hasPermission: boolean,
    scanned: boolean,
    dialogVisible: boolean,
    dialogTitle: string,
    dialogMessage: string,
    loading: boolean,
};

class ScannerScreen extends React.Component<Props, State> {

    state = {
        hasPermission: false,
        scanned: false,
        dialogVisible: false,
        dialogTitle: "",
        dialogMessage: "",
        loading: false,
    };

    constructor() {
        super();
    }

    componentDidMount() {
        this.requestPermissions();
    }

    /**
     * Requests permission to use the camera
     */
    requestPermissions = () => {
        if (Platform.OS === 'android')
            request(PERMISSIONS.ANDROID.CAMERA).then(this.updatePermissionStatus)
        else
            request(PERMISSIONS.IOS.CAMERA).then(this.updatePermissionStatus)
    };

    /**
     * Updates the state permission status
     *
     * @param result
     */
    updatePermissionStatus = (result) => this.setState({hasPermission: result === RESULTS.GRANTED});

    /**
     * Opens scanned link if it is a valid app link or shows and error dialog
     *
     * @param type The barcode type
     * @param data The scanned value
     */
    handleCodeScanned = ({type, data}) => {
        if (!URLHandler.isUrlValid(data))
            this.showErrorDialog();
        else {
            this.showOpeningDialog();
            Linking.openURL(data);
        }
    };

    /**
     * Gets a view asking user for permission to use the camera
     *
     * @returns {*}
     */
    getPermissionScreen() {
        return <View style={{marginLeft: 10, marginRight: 10}}>
            <Text>{i18n.t("scannerScreen.errorPermission")}</Text>
            <Button
                icon="camera"
                mode="contained"
                onPress={this.requestPermissions}
                style={{
                    marginTop: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                {i18n.t("scannerScreen.buttonPermission")}
            </Button>
        </View>
    }

    /**
     * Shows a dialog indicating how to use the scanner
     */
    showHelpDialog = () => {
        this.setState({
            dialogVisible: true,
            scanned: true,
            dialogTitle: i18n.t("scannerScreen.helpTitle"),
            dialogMessage: i18n.t("scannerScreen.helpMessage"),
        });
    };

    /**
     * Shows a loading dialog
     */
    showOpeningDialog = () => {
        this.setState({
            loading: true,
            scanned: true,
        });
    };

    /**
     * Shows a dialog indicating the user the scanned code was invalid
     */
    showErrorDialog() {
        this.setState({
            dialogVisible: true,
            scanned: true,
            dialogTitle: i18n.t("scannerScreen.errorTitle"),
            dialogMessage: i18n.t("scannerScreen.errorMessage"),
        });
    }

    /**
     * Hide any dialog
     */
    onDialogDismiss = () => this.setState({
        dialogVisible: false,
        scanned: false,
    });

    /**
     * Gets a view with the scanner.
     * This scanner uses the back camera, can only scan qr codes and has a square mask on the center.
     * The mask is only for design purposes as a code is scanned as soon as it enters the camera view
     *
     * @returns {*}
     */
    getScanner() {
        return (
            <RNCamera
                onBarCodeRead={this.state.scanned ? undefined : this.handleCodeScanned}
                type={RNCamera.Constants.Type.back}
                barCodeScannerSettings={{
                    barCodeTypes: [RNCamera.Constants.BarCodeType.qr],
                }}
                style={StyleSheet.absoluteFill}
                captureAudio={false}
            >
                <BarcodeMask
                    backgroundColor={"#000"}
                    maskOpacity={0.5}
                    animatedLineThickness={1}
                    animationDuration={1000}
                    width={250}
                    height={250}
                />
            </RNCamera>
        );
    }

    render() {
        return (
            <View style={{
                ...styles.container,
                marginBottom: CustomTabBar.TAB_BAR_HEIGHT
            }}>
                {this.state.hasPermission
                    ? this.getScanner()
                    : this.getPermissionScreen()
                }
                <Button
                    icon="information"
                    mode="contained"
                    onPress={this.showHelpDialog}
                    style={styles.button}
                >
                    {i18n.t("scannerScreen.helpButton")}
                </Button>
                <AlertDialog
                    visible={this.state.dialogVisible}
                    onDismiss={this.onDialogDismiss}
                    title={this.state.dialogTitle}
                    message={this.state.dialogMessage}
                />
                <LoadingConfirmDialog
                    visible={this.state.loading}
                    titleLoading={i18n.t("general.loading")}
                    startLoading={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        position: 'absolute',
        bottom: 20,
        width: '80%',
        left: '10%'
    },
});

export default withTheme(ScannerScreen);

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

    requestPermissions = () => {
        if (Platform.OS === 'android')
            request(PERMISSIONS.ANDROID.CAMERA).then(this.updatePermissionStatus)
        else
            request(PERMISSIONS.IOS.CAMERA).then(this.updatePermissionStatus)
    };

    updatePermissionStatus = (result) => this.setState({hasPermission: result === RESULTS.GRANTED});

    handleCodeScanned = ({type, data}) => {
        if (!URLHandler.isUrlValid(data))
            this.showErrorDialog();
        else {
            this.showOpeningDialog();
            Linking.openURL(data);
        }
    };

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

    showHelpDialog = () => {
        this.setState({
            dialogVisible: true,
            scanned: true,
            dialogTitle: i18n.t("scannerScreen.helpTitle"),
            dialogMessage: i18n.t("scannerScreen.helpMessage"),
        });
    };

    showOpeningDialog = () => {
        this.setState({
            loading: true,
            scanned: true,
        });
    };

    showErrorDialog() {
        this.setState({
            dialogVisible: true,
            scanned: true,
            dialogTitle: i18n.t("scannerScreen.errorTitle"),
            dialogMessage: i18n.t("scannerScreen.errorMessage"),
        });
    }

    onDialogDismiss = () => this.setState({
        dialogVisible: false,
        scanned: false,
    });

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

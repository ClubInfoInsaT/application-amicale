// @flow

import * as React from 'react';
import {StyleSheet, View} from "react-native";
import {Button, Text, withTheme} from 'react-native-paper';
import {BarCodeScanner} from "expo-barcode-scanner";
import {Camera} from 'expo-camera';
import URLHandler from "../../utils/URLHandler";
import {Linking} from "expo";
import AlertDialog from "../../components/Dialogs/AlertDialog";
import i18n from 'i18n-js';
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import LoadingConfirmDialog from "../../components/Dialogs/LoadingConfirmDialog";

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

    requestPermissions = () => Camera.requestPermissionsAsync().then(this.updatePermissionStatus);

    updatePermissionStatus = ({status}) => this.setState({hasPermission: status === "granted"});

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

    getOverlay() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <View style={{...overlayBackground, top: 0, height: '10%', width: '80%', left: '10%'}}/>
                    <View style={{...overlayBackground, left: 0, width: '10%', height: '100%'}}/>
                    <View style={{...overlayBackground, right: 0, width: '10%', height: '100%'}}/>
                    <View style={{...overlayBackground, bottom: 0, height: '10%', width: '80%', left: '10%'}}/>
                </View>

                <View style={styles.overlayTopLeft}>
                    <View style={{...overlayHorizontalLineStyle, top: 0}}/>
                    <View style={{...overlayVerticalLineStyle, left: 0}}/>
                </View>
                <View style={styles.overlayTopRight}>
                    <View style={{...overlayHorizontalLineStyle, top: 0}}/>
                    <View style={{...overlayVerticalLineStyle, right: 0}}/>
                </View>
                <View style={styles.overlayBottomLeft}>
                    <View style={{...overlayHorizontalLineStyle, bottom: 0}}/>
                    <View style={{...overlayVerticalLineStyle, left: 0}}/>
                </View>
                <View style={styles.overlayBottomRight}>
                    <View style={{...overlayHorizontalLineStyle, bottom: 0}}/>
                    <View style={{...overlayVerticalLineStyle, right: 0}}/>
                </View>
            </View>
        );
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
            <View style={styles.cameraContainer}>
                <Camera
                    onBarCodeScanned={this.state.scanned ? undefined : this.handleCodeScanned}
                    type={Camera.Constants.Type.back}
                    barCodeScannerSettings={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                    }}
                    style={StyleSheet.absoluteFill}
                    ratio={'1:1'}
                >
                    {this.getOverlay()}
                </Camera>
            </View>
        );
    }

    render() {
        return (
            <View style={{
                ...styles.container,
                marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
            }}>
                    {this.state.hasPermission
                        ? this.getScanner()
                        : this.getPermissionScreen()
                    }
                <View style={{height: 50}}>
                    <Button
                        icon="information"
                        mode="contained"
                        onPress={this.showHelpDialog}
                        style={styles.button}
                    >
                        {i18n.t("scannerScreen.helpButton")}
                    </Button>
                </View>
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

const borderOffset = '10%';

const overlayBoxStyle = {
    position: 'absolute',
    width: 25,
    height: 25,
};

const overlayLineStyle = {
    position: 'absolute',
    backgroundColor: "#fff",
    borderRadius: 2,
};

const overlayHorizontalLineStyle = {
    ...overlayLineStyle,
    width: '100%',
    height: 5,
};

const overlayVerticalLineStyle = {
    ...overlayLineStyle,
    height: '100%',
    width: 5,
};

const overlayBackground = {
    backgroundColor: "rgba(0,0,0,0.47)",
    position: "absolute",
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraContainer: {
        marginTop: 'auto',
        marginBottom: 'auto',
        aspectRatio: 1,
        width: '100%',
    },
    button: {
        position: 'absolute',
        bottom: 5,
        width: '80%',
        left: '10%'
    },
    overlayTopLeft: {
        ...overlayBoxStyle,
        top: borderOffset,
        left: borderOffset,
    },
    overlayTopRight: {
        ...overlayBoxStyle,
        top: borderOffset,
        right: borderOffset,
    },
    overlayBottomLeft: {
        ...overlayBoxStyle,
        bottom: borderOffset,
        left: borderOffset,
    },
    overlayBottomRight: {
        ...overlayBoxStyle,
        bottom: borderOffset,
        right: borderOffset,
    },
});

export default withTheme(ScannerScreen);

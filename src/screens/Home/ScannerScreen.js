// @flow

import * as React from 'react';
import {Linking, Platform, StyleSheet, View} from 'react-native';
import {Button, Text, withTheme} from 'react-native-paper';
import {RNCamera} from 'react-native-camera';
import {BarcodeMask} from '@nartc/react-native-barcode-mask';
import i18n from 'i18n-js';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import URLHandler from '../../utils/URLHandler';
import AlertDialog from '../../components/Dialogs/AlertDialog';
import CustomTabBar from '../../components/Tabbar/CustomTabBar';
import LoadingConfirmDialog from '../../components/Dialogs/LoadingConfirmDialog';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';

type StateType = {
  hasPermission: boolean,
  scanned: boolean,
  dialogVisible: boolean,
  mascotDialogVisible: boolean,
  loading: boolean,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    left: '10%',
  },
});

class ScannerScreen extends React.Component<null, StateType> {
  constructor() {
    super();
    this.state = {
      hasPermission: false,
      scanned: false,
      mascotDialogVisible: false,
      dialogVisible: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.requestPermissions();
  }

  /**
   * Gets a view asking user for permission to use the camera
   *
   * @returns {*}
   */
  getPermissionScreen(): React.Node {
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <Text>{i18n.t('screens.scanner.permissions.error')}</Text>
        <Button
          icon="camera"
          mode="contained"
          onPress={this.requestPermissions}
          style={{
            marginTop: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
          {i18n.t('screens.scanner.permissions.button')}
        </Button>
      </View>
    );
  }

  /**
   * Gets a view with the scanner.
   * This scanner uses the back camera, can only scan qr codes and has a square mask on the center.
   * The mask is only for design purposes as a code is scanned as soon as it enters the camera view
   *
   * @returns {*}
   */
  getScanner(): React.Node {
    const {state} = this;
    return (
      <RNCamera
        onBarCodeRead={state.scanned ? null : this.onCodeScanned}
        type={RNCamera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: [RNCamera.Constants.BarCodeType.qr],
        }}
        style={StyleSheet.absoluteFill}
        captureAudio={false}>
        <BarcodeMask
          backgroundColor="#000"
          maskOpacity={0.5}
          animatedLineThickness={1}
          animationDuration={1000}
          width={250}
          height={250}
        />
      </RNCamera>
    );
  }

  /**
   * Requests permission to use the camera
   */
  requestPermissions = () => {
    if (Platform.OS === 'android')
      request(PERMISSIONS.ANDROID.CAMERA).then(this.updatePermissionStatus);
    else request(PERMISSIONS.IOS.CAMERA).then(this.updatePermissionStatus);
  };

  /**
   * Updates the state permission status
   *
   * @param result
   */
  updatePermissionStatus = (result: RESULTS) => {
    this.setState({
      hasPermission: result === RESULTS.GRANTED,
    });
  };

  /**
   * Shows a dialog indicating the user the scanned code was invalid
   */
  // eslint-disable-next-line react/sort-comp
  showErrorDialog() {
    this.setState({
      dialogVisible: true,
      scanned: true,
    });
  }

  /**
   * Shows a dialog indicating how to use the scanner
   */
  showHelpDialog = () => {
    this.setState({
      mascotDialogVisible: true,
      scanned: true,
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
   * Hide any dialog
   */
  onDialogDismiss = () => {
    this.setState({
      dialogVisible: false,
      scanned: false,
    });
  };

  onMascotDialogDismiss = () => {
    this.setState({
      mascotDialogVisible: false,
      scanned: false,
    });
  };

  /**
   * Opens scanned link if it is a valid app link or shows and error dialog
   *
   * @param type The barcode type
   * @param data The scanned value
   */
  onCodeScanned = ({data}: {data: string}) => {
    if (!URLHandler.isUrlValid(data)) this.showErrorDialog();
    else {
      this.showOpeningDialog();
      Linking.openURL(data);
    }
  };

  render(): React.Node {
    const {state} = this;
    return (
      <View
        style={{
          ...styles.container,
          marginBottom: CustomTabBar.TAB_BAR_HEIGHT,
        }}>
        {state.hasPermission ? this.getScanner() : this.getPermissionScreen()}
        <Button
          icon="information"
          mode="contained"
          onPress={this.showHelpDialog}
          style={styles.button}>
          {i18n.t('screens.scanner.help.button')}
        </Button>
        <MascotPopup
          visible={state.mascotDialogVisible}
          title={i18n.t('screens.scanner.mascotDialog.title')}
          message={i18n.t('screens.scanner.mascotDialog.message')}
          icon="camera-iris"
          buttons={{
            action: null,
            cancel: {
              message: i18n.t('screens.scanner.mascotDialog.button'),
              icon: 'check',
              onPress: this.onMascotDialogDismiss,
            },
          }}
          emotion={MASCOT_STYLE.NORMAL}
        />
        <AlertDialog
          visible={state.dialogVisible}
          onDismiss={this.onDialogDismiss}
          title={i18n.t('screens.scanner.error.title')}
          message={i18n.t('screens.scanner.error.message')}
        />
        <LoadingConfirmDialog
          visible={state.loading}
          titleLoading={i18n.t('general.loading')}
          startLoading
        />
      </View>
    );
  }
}

export default withTheme(ScannerScreen);

// @flow

import * as React from 'react';
import {View} from 'react-native';
import {
  Button,
  List,
  Subheading,
  TextInput,
  Title,
  withTheme,
} from 'react-native-paper';
import {Modalize} from 'react-native-modalize';
import CustomModal from '../../components/Overrides/CustomModal';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import type {CustomThemeType} from '../../managers/ThemeManager';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';

type PreferenceItemType = {
  key: string,
  default: string,
  current: string,
};

type PropsType = {
  theme: CustomThemeType,
};

type StateType = {
  modalCurrentDisplayItem: PreferenceItemType,
  currentPreferences: Array<PreferenceItemType>,
};

/**
 * Class defining the Debug screen.
 * This screen allows the user to get and modify information on the app/device.
 */
class DebugScreen extends React.Component<PropsType, StateType> {
  modalRef: Modalize;

  modalInputValue: string;

  /**
   * Copies user preferences to state for easier manipulation
   *
   * @param props
   */
  constructor(props: PropsType) {
    super(props);
    this.modalInputValue = '';
    const currentPreferences: Array<PreferenceItemType> = [];
    // eslint-disable-next-line flowtype/no-weak-types
    Object.values(AsyncStorageManager.PREFERENCES).forEach((object: any) => {
      const newObject: PreferenceItemType = {...object};
      newObject.current = AsyncStorageManager.getString(newObject.key);
      currentPreferences.push(newObject);
    });
    this.state = {
      modalCurrentDisplayItem: {},
      currentPreferences,
    };
  }

  /**
   * Gets the edit modal content
   *
   * @return {*}
   */
  getModalContent(): React.Node {
    const {props, state} = this;
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
        }}>
        <Title>{state.modalCurrentDisplayItem.key}</Title>
        <Subheading>
          Default: {state.modalCurrentDisplayItem.default}
        </Subheading>
        <Subheading>
          Current: {state.modalCurrentDisplayItem.current}
        </Subheading>
        <TextInput
          label="New Value"
          onChangeText={(text: string) => {
            this.modalInputValue = text;
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <Button
            mode="contained"
            dark
            color={props.theme.colors.success}
            onPress={() => {
              this.saveNewPrefs(
                state.modalCurrentDisplayItem.key,
                this.modalInputValue,
              );
            }}>
            Save new value
          </Button>
          <Button
            mode="contained"
            dark
            color={props.theme.colors.danger}
            onPress={() => {
              this.saveNewPrefs(
                state.modalCurrentDisplayItem.key,
                state.modalCurrentDisplayItem.default,
              );
            }}>
            Reset to default
          </Button>
        </View>
      </View>
    );
  }

  getRenderItem = ({item}: {item: PreferenceItemType}): React.Node => {
    return (
      <List.Item
        title={item.key}
        description="Click to edit"
        onPress={() => {
          this.showEditModal(item);
        }}
      />
    );
  };

  /**
   * Callback used when receiving the modal ref
   *
   * @param ref
   */
  onModalRef = (ref: Modalize) => {
    this.modalRef = ref;
  };

  /**
   * Shows the edit modal
   *
   * @param item
   */
  showEditModal(item: PreferenceItemType) {
    this.setState({
      modalCurrentDisplayItem: item,
    });
    if (this.modalRef) this.modalRef.open();
  }

  /**
   * Finds the index of the given key in the preferences array
   *
   * @param key THe key to find the index of
   * @returns {number}
   */
  findIndexOfKey(key: string): number {
    const {currentPreferences} = this.state;
    let index = -1;
    for (let i = 0; i < currentPreferences.length; i += 1) {
      if (currentPreferences[i].key === key) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * Saves the new value of the given preference
   *
   * @param key The pref key
   * @param value The pref value
   */
  saveNewPrefs(key: string, value: string) {
    this.setState((prevState: StateType): {
      currentPreferences: Array<PreferenceItemType>,
    } => {
      const currentPreferences = [...prevState.currentPreferences];
      currentPreferences[this.findIndexOfKey(key)].current = value;
      return {currentPreferences};
    });
    AsyncStorageManager.set(key, value);
    this.modalRef.close();
  }

  render(): React.Node {
    const {state} = this;
    return (
      <View>
        <CustomModal onRef={this.onModalRef}>
          {this.getModalContent()}
        </CustomModal>
        {/* $FlowFixMe */}
        <CollapsibleFlatList
          data={state.currentPreferences}
          extraData={state.currentPreferences}
          renderItem={this.getRenderItem}
        />
      </View>
    );
  }
}

export default withTheme(DebugScreen);

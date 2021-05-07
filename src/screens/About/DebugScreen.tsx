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
import { StyleSheet, View } from 'react-native';
import {
  Button,
  List,
  Subheading,
  TextInput,
  Title,
  withTheme,
} from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import CustomModal from '../../components/Overrides/CustomModal';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';

type PreferenceItemType = {
  key: string;
  default: string;
  current: string;
};

type PropsType = {
  theme: ReactNativePaper.Theme;
};

type StateType = {
  modalCurrentDisplayItem: PreferenceItemType | null;
  currentPreferences: Array<PreferenceItemType>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

/**
 * Class defining the Debug screen.
 * This screen allows the user to get and modify information on the app/device.
 */
class DebugScreen extends React.Component<PropsType, StateType> {
  modalRef: Modalize | null;

  modalInputValue: string;

  /**
   * Copies user preferences to state for easier manipulation
   *
   * @param props
   */
  constructor(props: PropsType) {
    super(props);
    this.modalRef = null;
    this.modalInputValue = '';
    const currentPreferences: Array<PreferenceItemType> = [];
    Object.values(AsyncStorageManager.PREFERENCES).forEach((object: any) => {
      const newObject: PreferenceItemType = { ...object };
      newObject.current = AsyncStorageManager.getString(newObject.key);
      currentPreferences.push(newObject);
    });
    this.state = {
      modalCurrentDisplayItem: null,
      currentPreferences,
    };
  }

  /**
   * Gets the edit modal content
   *
   * @return {*}
   */
  getModalContent() {
    const { props, state } = this;
    let key = '';
    let defaultValue = '';
    let current = '';
    if (state.modalCurrentDisplayItem) {
      key = state.modalCurrentDisplayItem.key;
      defaultValue = state.modalCurrentDisplayItem.default;
      defaultValue = state.modalCurrentDisplayItem.default;
      current = state.modalCurrentDisplayItem.current;
    }

    return (
      <View style={styles.container}>
        <Title>{key}</Title>
        <Subheading>Default: {defaultValue}</Subheading>
        <Subheading>Current: {current}</Subheading>
        <TextInput
          label="New Value"
          onChangeText={(text: string) => {
            this.modalInputValue = text;
          }}
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            dark
            color={props.theme.colors.success}
            onPress={() => {
              this.saveNewPrefs(key, this.modalInputValue);
            }}
          >
            Save new value
          </Button>
          <Button
            mode="contained"
            dark
            color={props.theme.colors.danger}
            onPress={() => {
              this.saveNewPrefs(key, defaultValue);
            }}
          >
            Reset to default
          </Button>
        </View>
      </View>
    );
  }

  getRenderItem = ({ item }: { item: PreferenceItemType }) => {
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
    if (this.modalRef) {
      this.modalRef.open();
    }
  }

  /**
   * Finds the index of the given key in the preferences array
   *
   * @param key THe key to find the index of
   * @returns {number}
   */
  findIndexOfKey(key: string): number {
    const { currentPreferences } = this.state;
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
      currentPreferences: Array<PreferenceItemType>;
    } => {
      const currentPreferences = [...prevState.currentPreferences];
      currentPreferences[this.findIndexOfKey(key)].current = value;
      return { currentPreferences };
    });
    AsyncStorageManager.set(key, value);
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  render() {
    const { state } = this;
    return (
      <View>
        <CustomModal onRef={this.onModalRef}>
          {this.getModalContent()}
        </CustomModal>
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

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

import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  List,
  Subheading,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import { Modalize } from 'react-native-modalize';
import CustomModal from '../../components/Overrides/CustomModal';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import { usePreferences } from '../../context/preferencesContext';
import {
  defaultPreferences,
  GeneralPreferenceKeys,
  isValidGeneralPreferenceKey,
} from '../../utils/asyncStorage';

type PreferenceItemType = {
  key: string;
  default: string;
  current: string;
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
function DebugScreen() {
  const theme = useTheme();
  const { preferences, updatePreferences } = usePreferences();
  const modalRef = useRef<Modalize>(null);

  const [modalInputValue, setModalInputValue] = useState<string>('');
  const [
    modalCurrentDisplayItem,
    setModalCurrentDisplayItem,
  ] = useState<PreferenceItemType | null>(null);

  const currentPreferences: Array<PreferenceItemType> = [];
  Object.values(GeneralPreferenceKeys).forEach((key) => {
    const newObject: PreferenceItemType = {
      key: key,
      current: preferences[key],
      default: defaultPreferences[key],
    };
    currentPreferences.push(newObject);
  });

  const getModalContent = () => {
    let key = '';
    let defaultValue = '';
    let current = '';
    if (modalCurrentDisplayItem) {
      key = modalCurrentDisplayItem.key;
      defaultValue = modalCurrentDisplayItem.default;
      current = modalCurrentDisplayItem.current;
    }

    return (
      <View style={styles.container}>
        <Title>{key}</Title>
        <Subheading>Default: {defaultValue}</Subheading>
        <Subheading>Current: {current}</Subheading>
        <TextInput label={'New Value'} onChangeText={setModalInputValue} />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            dark
            color={theme.colors.success}
            onPress={() => {
              saveNewPrefs(key, modalInputValue);
            }}
          >
            Save new value
          </Button>
          <Button
            mode="contained"
            dark
            color={theme.colors.danger}
            onPress={() => {
              saveNewPrefs(key, defaultValue);
            }}
          >
            Reset to default
          </Button>
        </View>
      </View>
    );
  };

  const getRenderItem = ({ item }: { item: PreferenceItemType }) => {
    return (
      <List.Item
        title={item.key}
        description="Click to edit"
        onPress={() => {
          showEditModal(item);
        }}
      />
    );
  };

  const showEditModal = (item: PreferenceItemType) => {
    setModalCurrentDisplayItem(item);
    if (modalRef.current) {
      modalRef.current.open();
    }
  };

  const saveNewPrefs = (key: string, value: string) => {
    if (isValidGeneralPreferenceKey(key)) {
      updatePreferences(key, value);
    }
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <View>
      <CustomModal ref={modalRef}>{getModalContent()}</CustomModal>
      <CollapsibleFlatList
        data={currentPreferences}
        extraData={currentPreferences}
        renderItem={getRenderItem}
      />
    </View>
  );
}

export default DebugScreen;

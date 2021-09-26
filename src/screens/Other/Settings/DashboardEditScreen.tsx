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
import { Button, Card, Paragraph } from 'react-native-paper';
import { FlatList, StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import i18n from 'i18n-js';
import DashboardEditAccordion from '../../../components/Lists/DashboardEdit/DashboardEditAccordion';
import DashboardEditPreviewItem from '../../../components/Lists/DashboardEdit/DashboardEditPreviewItem';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';
import {
  getCategories,
  ServiceCategoryType,
  ServiceItemType,
} from '../../../utils/Services';
import { useNavigation } from '@react-navigation/core';
import { useCurrentDashboard } from '../../../context/preferencesContext';
import { useLoginState } from '../../../context/loginContext';

const styles = StyleSheet.create({
  dashboardContainer: {
    height: 50,
  },
  dashboard: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  card: {
    margin: 5,
  },
  buttonContainer: {
    padding: 5,
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
  },
});

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
function DashboardEditScreen() {
  const navigation = useNavigation();
  const isLoggedIn = useLoginState();

  const { currentDashboard, currentDashboardIdList, updateCurrentDashboard } =
    useCurrentDashboard();
  const initialDashboard = useRef(currentDashboardIdList);
  const [activeItem, setActiveItem] = useState(0);
  const getDashboardRowRenderItem = ({
    item,
    index,
  }: {
    item: ServiceItemType | undefined;
    index: number;
  }) => {
    return (
      <DashboardEditPreviewItem
        image={item?.image}
        onPress={() => {
          setActiveItem(index);
        }}
        isActive={activeItem === index}
      />
    );
  };

  const getDashboard = (content: Array<ServiceItemType | undefined>) => {
    return (
      <FlatList
        data={content}
        extraData={activeItem}
        renderItem={getDashboardRowRenderItem}
        horizontal
        contentContainerStyle={styles.dashboard}
      />
    );
  };

  const getRenderItem = ({ item }: { item: ServiceCategoryType }) => {
    return (
      <DashboardEditAccordion
        item={item}
        onPress={updateCurrentDashboard}
        activeDashboard={currentDashboardIdList}
        activeItem={activeItem}
      />
    );
  };

  const getListHeader = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.buttonContainer}>
            <Button
              mode={'contained'}
              onPress={undoDashboard}
              style={styles.button}
            >
              {i18n.t('screens.settings.dashboardEdit.undo')}
            </Button>
            <View style={styles.dashboardContainer}>
              {getDashboard(currentDashboard)}
            </View>
          </View>
          <Paragraph style={styles.text}>
            {i18n.t('screens.settings.dashboardEdit.message')}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const undoDashboard = () => {
    updateCurrentDashboard(initialDashboard.current);
  };

  return (
    <CollapsibleFlatList
      //@ts-ignore
      data={getCategories(navigation.navigate, isLoggedIn)}
      renderItem={getRenderItem}
      ListHeaderComponent={getListHeader()}
      extraData={activeItem}
    />
  );
}

export default DashboardEditScreen;

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

// @flow

import * as React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button, Card, Paragraph, withTheme} from 'react-native-paper';
import {FlatList} from 'react-native';
import {View} from 'react-native-animatable';
import i18n from 'i18n-js';
import type {
  ServiceCategoryType,
  ServiceItemType,
} from '../../../managers/ServicesManager';
import DashboardManager from '../../../managers/DashboardManager';
import DashboardItem from '../../../components/Home/EventDashboardItem';
import DashboardEditAccordion from '../../../components/Lists/DashboardEdit/DashboardEditAccordion';
import DashboardEditPreviewItem from '../../../components/Lists/DashboardEdit/DashboardEditPreviewItem';
import AsyncStorageManager from '../../../managers/AsyncStorageManager';
import CollapsibleFlatList from '../../../components/Collapsible/CollapsibleFlatList';

type PropsType = {
  navigation: StackNavigationProp,
};

type StateType = {
  currentDashboard: Array<ServiceItemType | null>,
  currentDashboardIdList: Array<string>,
  activeItem: number,
};

/**
 * Class defining the Settings screen. This screen shows controls to modify app preferences.
 */
class DashboardEditScreen extends React.Component<PropsType, StateType> {
  content: Array<ServiceCategoryType>;

  initialDashboard: Array<ServiceItemType | null>;

  initialDashboardIdList: Array<string>;

  constructor(props: PropsType) {
    super(props);
    const dashboardManager = new DashboardManager(props.navigation);
    this.initialDashboardIdList = AsyncStorageManager.getObject(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
    );
    this.initialDashboard = dashboardManager.getCurrentDashboard();
    this.state = {
      currentDashboard: [...this.initialDashboard],
      currentDashboardIdList: [...this.initialDashboardIdList],
      activeItem: 0,
    };
    this.content = dashboardManager.getCategories();
  }

  getDashboardRowRenderItem = ({
    item,
    index,
  }: {
    item: DashboardItem,
    index: number,
  }): React.Node => {
    const {activeItem} = this.state;
    return (
      <DashboardEditPreviewItem
        image={item.image}
        onPress={() => {
          this.setState({activeItem: index});
        }}
        isActive={activeItem === index}
      />
    );
  };

  getDashboard(content: Array<DashboardItem>): React.Node {
    return (
      <FlatList
        data={content}
        extraData={this.state}
        renderItem={this.getDashboardRowRenderItem}
        horizontal
        contentContainerStyle={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 5,
        }}
      />
    );
  }

  getRenderItem = ({item}: {item: ServiceCategoryType}): React.Node => {
    const {currentDashboardIdList} = this.state;
    return (
      <DashboardEditAccordion
        item={item}
        onPress={this.updateDashboard}
        activeDashboard={currentDashboardIdList}
      />
    );
  };

  getListHeader(): React.Node {
    const {currentDashboard} = this.state;
    return (
      <Card style={{margin: 5}}>
        <Card.Content>
          <View style={{padding: 5}}>
            <Button
              mode="contained"
              onPress={this.undoDashboard}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 10,
              }}>
              {i18n.t('screens.settings.dashboardEdit.undo')}
            </Button>
            <View style={{height: 50}}>
              {this.getDashboard(currentDashboard)}
            </View>
          </View>
          <Paragraph style={{textAlign: 'center'}}>
            {i18n.t('screens.settings.dashboardEdit.message')}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  }

  updateDashboard = (service: ServiceItemType) => {
    const {currentDashboard, currentDashboardIdList, activeItem} = this.state;
    currentDashboard[activeItem] = service;
    currentDashboardIdList[activeItem] = service.key;
    this.setState({
      currentDashboard,
      currentDashboardIdList,
    });
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
      currentDashboardIdList,
    );
  };

  undoDashboard = () => {
    this.setState({
      currentDashboard: [...this.initialDashboard],
      currentDashboardIdList: [...this.initialDashboardIdList],
    });
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.dashboardItems.key,
      this.initialDashboardIdList,
    );
  };

  render(): React.Node {
    return (
      <CollapsibleFlatList
        data={this.content}
        renderItem={this.getRenderItem}
        ListHeaderComponent={this.getListHeader()}
        style={{}}
      />
    );
  }
}

export default withTheme(DashboardEditScreen);

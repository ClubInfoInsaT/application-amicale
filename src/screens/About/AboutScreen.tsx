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

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { StackNavigationProp } from '@react-navigation/stack';
import packageJson from '../../../package.json';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import OptionsDialog from '../../components/Dialogs/OptionsDialog';
import type { OptionsDialogButtonType } from '../../components/Dialogs/OptionsDialog';
import GENERAL_STYLES from '../../constants/Styles';
import AboutCard from '../../components/About/AboutCard';
import {
  getAppData,
  getTeamData,
  getTechnoData,
  getThanksData,
  MemberItemType,
  openWebLink,
} from '../../constants/AboutData';
import { useNavigation } from '@react-navigation/core';

const APP_LOGO = require('../../../assets/android.icon.round.png');

const styles = StyleSheet.create({
  list: {
    padding: 5,
  },
});

/**
 * Order of information cards
 */
const DATA_ORDER = [
  {
    id: 'app',
  },
  {
    id: 'team',
  },
  {
    id: 'thanks',
  },
  {
    id: 'techno',
  },
];

/**
 * Function defining an about screen. This screen shows the user information about the app and it's author.
 */
function AboutScreen() {
  const [dialog, setDialog] = useState<{
    title: string;
    message: string;
    buttons: Array<OptionsDialogButtonType>;
  }>();
  const navigation = useNavigation<StackNavigationProp<any>>();

  /**
   * Callback used when clicking a member in the list
   * It opens a dialog to show detailed information this member
   *
   * @param user The member to show information for
   */
  const onContributorListItemPress = (user: MemberItemType) => {
    const dialogBtn: Array<OptionsDialogButtonType> = [
      {
        title: 'OK',
        onPress: onDialogDismiss,
      },
    ];
    const { linkedin, trollLink, mail } = user;
    if (linkedin != null) {
      dialogBtn.push({
        title: '',
        icon: 'linkedin',
        onPress: () => {
          openWebLink(linkedin);
        },
      });
    }
    if (mail) {
      dialogBtn.push({
        title: '',
        icon: 'email-edit',
        onPress: () => {
          openWebLink(mail);
        },
      });
    }
    if (trollLink) {
      dialogBtn.push({
        title: 'Coucou',
        onPress: () => {
          openWebLink(trollLink);
        },
      });
    }
    setDialog({
      title: user.name,
      message: user.message,
      buttons: dialogBtn,
    });
  };

  function getAppCard() {
    return (
      <AboutCard
        title={'Campus'}
        subtitle={packageJson.version}
        image={APP_LOGO}
        data={getAppData(navigation)}
      />
    );
  }

  function getTeamCard() {
    return (
      <AboutCard
        title={i18n.t('screens.about.team')}
        icon={'account-multiple'}
        data={getTeamData(navigation, onContributorListItemPress)}
      />
    );
  }

  function getThanksCard() {
    return (
      <AboutCard
        title={i18n.t('screens.about.thanks')}
        icon={'hand-heart'}
        data={getThanksData(onContributorListItemPress)}
      />
    );
  }

  function getTechnoCard() {
    return (
      <AboutCard
        title={i18n.t('screens.about.technologies')}
        icon={'wrench'}
        data={getTechnoData(navigation)}
      />
    );
  }

  const renderItem = ({ item }: { item: { id: string } }) => {
    switch (item.id) {
      case 'app':
        return getAppCard();
      case 'team':
        return getTeamCard();
      case 'thanks':
        return getThanksCard();
      case 'techno':
        return getTechnoCard();
      default:
        return null;
    }
  };

  const onDialogDismiss = () => setDialog(undefined);

  return (
    <View style={GENERAL_STYLES.flex}>
      <CollapsibleFlatList
        style={styles.list}
        data={DATA_ORDER}
        renderItem={renderItem}
      />
      {dialog != null ? (
        <OptionsDialog
          visible={dialog != null}
          title={dialog.title}
          message={dialog.message}
          buttons={dialog.buttons}
          onDismiss={onDialogDismiss}
        />
      ) : null}
    </View>
  );
}

export default AboutScreen;

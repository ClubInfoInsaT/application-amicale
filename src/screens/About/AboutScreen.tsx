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
import {FlatList, Linking, Platform, Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Avatar, Card, List} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import packageJson from '../../../package.json';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import OptionsDialog from '../../components/Dialogs/OptionsDialog';
import type {OptionsDialogButtonType} from '../../components/Dialogs/OptionsDialog';

const APP_LOGO = require('../../../assets/android.icon.round.png');

type ListItemType = {
  onPressCallback: () => void;
  icon: string;
  text: string;
  showChevron: boolean;
};

type MemberItemType = {
  name: string;
  message: string;
  icon: string;
  trollLink?: string;
  linkedin?: string;
  mail?: string;
};

const links = {
  appstore: 'https://apps.apple.com/us/app/campus-amicale-insat/id1477722148',
  playstore:
    'https://play.google.com/store/apps/details?id=fr.amicaleinsat.application',
  git:
    'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/README.md',
  changelog:
    'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/Changelog.md',
  license:
    'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/LICENSE',
  react: 'https://facebook.github.io/react-native/',
};

type PropsType = {
  navigation: StackNavigationProp<any>;
};

type StateType = {
  dialogVisible: boolean;
  dialogTitle: string;
  dialogMessage: string;
  dialogButtons: Array<OptionsDialogButtonType>;
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link: string) {
  Linking.openURL(link);
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
class AboutScreen extends React.Component<PropsType, StateType> {
  /**
   * Object containing data relative to major contributors
   */
  majorContributors: {[key: string]: MemberItemType} = {
    arnaud: {
      name: 'Arnaud Vergnet',
      message: i18n.t('screens.about.user.arnaud'),
      icon: 'crown',
      trollLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      linkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
      mail:
        'mailto:vergnet@etud.insa-toulouse.fr?' +
        'subject=' +
        'Application Amicale INSA Toulouse' +
        '&body=' +
        'Coucou !\n\n',
    },
    yohan: {
      name: 'Yohan Simard',
      message: i18n.t('screens.about.user.yohan'),
      icon: 'xml',
      linkedin: 'https://www.linkedin.com/in/yohan-simard',
      mail:
        'mailto:ysimard@etud.insa-toulouse.fr?' +
        'subject=' +
        'Application Amicale INSA Toulouse' +
        '&body=' +
        'Coucou !\n\n',
    },
  };

  /**
   * Object containing data relative to users who helped during development
   */
  helpfulUsers: {[key: string]: MemberItemType} = {
    beranger: {
      name: 'Béranger Quintana Y Arciosana',
      message: i18n.t('screens.about.user.beranger'),
      icon: 'account-heart',
    },
    celine: {
      name: 'Céline Tassin',
      message: i18n.t('screens.about.user.celine'),
      icon: 'brush',
    },
    damien: {
      name: 'Damien Molina',
      message: i18n.t('screens.about.user.damien'),
      icon: 'web',
    },
    titouan: {
      name: 'Titouan Labourdette',
      message: i18n.t('screens.about.user.titouan'),
      icon: 'shield-bug',
    },
    theo: {
      name: 'Théo Tami',
      message: i18n.t('screens.about.user.theo'),
      icon: 'food-apple',
    },
  };

  /**
   * Data to be displayed in the app card
   */
  appData: Array<ListItemType> = [
    {
      onPressCallback: () => {
        openWebLink(Platform.OS === 'ios' ? links.appstore : links.playstore);
      },
      icon: Platform.OS === 'ios' ? 'apple' : 'google-play',
      text:
        Platform.OS === 'ios'
          ? i18n.t('screens.about.appstore')
          : i18n.t('screens.about.playstore'),
      showChevron: true,
    },
    {
      onPressCallback: () => {
        const {navigation} = this.props;
        navigation.navigate('feedback');
      },
      icon: 'bug',
      text: i18n.t('screens.feedback.homeButtonTitle'),
      showChevron: true,
    },
    {
      onPressCallback: () => {
        openWebLink(links.git);
      },
      icon: 'git',
      text: 'Git',
      showChevron: true,
    },
    {
      onPressCallback: () => {
        openWebLink(links.changelog);
      },
      icon: 'refresh',
      text: i18n.t('screens.about.changelog'),
      showChevron: true,
    },
    {
      onPressCallback: () => {
        openWebLink(links.license);
      },
      icon: 'file-document',
      text: i18n.t('screens.about.license'),
      showChevron: true,
    },
  ];

  /**
   * Data to be displayed in the team card
   */
  teamData: Array<ListItemType> = [
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.majorContributors.arnaud);
      },
      icon: this.majorContributors.arnaud.icon,
      text: this.majorContributors.arnaud.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.majorContributors.yohan);
      },
      icon: this.majorContributors.yohan.icon,
      text: this.majorContributors.yohan.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        const {navigation} = this.props;
        navigation.navigate('feedback');
      },
      icon: 'hand-pointing-right',
      text: i18n.t('screens.about.user.you'),
      showChevron: true,
    },
  ];

  /**
   * Data to be displayed in the thanks card
   */
  thanksData: Array<ListItemType> = [
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.helpfulUsers.beranger);
      },
      icon: this.helpfulUsers.beranger.icon,
      text: this.helpfulUsers.beranger.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.helpfulUsers.celine);
      },
      icon: this.helpfulUsers.celine.icon,
      text: this.helpfulUsers.celine.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.helpfulUsers.damien);
      },
      icon: this.helpfulUsers.damien.icon,
      text: this.helpfulUsers.damien.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.helpfulUsers.titouan);
      },
      icon: this.helpfulUsers.titouan.icon,
      text: this.helpfulUsers.titouan.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(this.helpfulUsers.theo);
      },
      icon: this.helpfulUsers.theo.icon,
      text: this.helpfulUsers.theo.name,
      showChevron: false,
    },
  ];

  /**
   * Data to be displayed in the technologies card
   */
  technoData = [
    {
      onPressCallback: () => {
        openWebLink(links.react);
      },
      icon: 'react',
      text: i18n.t('screens.about.reactNative'),
      showChevron: true,
    },
    {
      onPressCallback: () => {
        const {navigation} = this.props;
        navigation.navigate('dependencies');
      },
      icon: 'developer-board',
      text: i18n.t('screens.about.libs'),
      showChevron: true,
    },
  ];

  /**
   * Order of information cards
   */
  dataOrder = [
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

  constructor(props: PropsType) {
    super(props);
    this.state = {
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogButtons: [],
    };
  }

  /**
   * Callback used when clicking a member in the list
   * It opens a dialog to show detailed information this member
   *
   * @param user The member to show information for
   */
  onContributorListItemPress(user: MemberItemType) {
    const dialogBtn: Array<OptionsDialogButtonType> = [
      {
        title: 'OK',
        onPress: this.onDialogDismiss,
      },
    ];
    const {linkedin, trollLink, mail} = user;
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
        title: 'SWAG',
        onPress: () => {
          openWebLink(trollLink);
        },
      });
    }
    this.setState({
      dialogVisible: true,
      dialogTitle: user.name,
      dialogMessage: user.message,
      dialogButtons: dialogBtn,
    });
  }

  /**
   * Gets the app card showing information and links about the app.
   *
   * @return {*}
   */
  getAppCard() {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title="Campus"
          subtitle={packageJson.version}
          left={(iconProps) => (
            <Image
              source={APP_LOGO}
              style={{width: iconProps.size, height: iconProps.size}}
            />
          )}
        />
        <Card.Content>
          <FlatList
            data={this.appData}
            keyExtractor={this.keyExtractor}
            renderItem={this.getCardItem}
          />
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets the team card showing information and links about the team
   *
   * @return {*}
   */
  getTeamCard() {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.team')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="account-multiple" />
          )}
        />
        <Card.Content>
          <FlatList
            data={this.teamData}
            keyExtractor={this.keyExtractor}
            renderItem={this.getCardItem}
          />
        </Card.Content>
      </Card>
    );
  }

  /**
   * Get the thank you card showing support information and links
   *
   * @return {*}
   */
  getThanksCard() {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.thanks')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="hand-heart" />
          )}
        />
        <Card.Content>
          <FlatList
            data={this.thanksData}
            keyExtractor={this.keyExtractor}
            renderItem={this.getCardItem}
          />
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets the techno card showing information and links about the technologies used in the app
   *
   * @return {*}
   */
  getTechnoCard() {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.technologies')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="wrench" />
          )}
        />
        <Card.Content>
          <FlatList
            data={this.technoData}
            keyExtractor={this.keyExtractor}
            renderItem={this.getCardItem}
          />
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets a chevron icon
   *
   * @param props
   * @return {*}
   */
  static getChevronIcon(props: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) {
    return (
      <List.Icon color={props.color} style={props.style} icon="chevron-right" />
    );
  }

  /**
   * Gets a custom list item icon
   *
   * @param item The item to show the icon for
   * @param props
   * @return {*}
   */
  static getItemIcon(
    item: ListItemType,
    props: {
      color: string;
      style?: {
        marginRight: number;
        marginVertical?: number;
      };
    },
  ) {
    return (
      <List.Icon color={props.color} style={props.style} icon={item.icon} />
    );
  }

  /**
   * Gets a clickable card item to be rendered inside a card.
   *
   * @returns {*}
   */
  getCardItem = ({item}: {item: ListItemType}) => {
    const getItemIcon = (props: {
      color: string;
      style?: {
        marginRight: number;
        marginVertical?: number;
      };
    }) => AboutScreen.getItemIcon(item, props);
    if (item.showChevron) {
      return (
        <List.Item
          title={item.text}
          left={getItemIcon}
          right={AboutScreen.getChevronIcon}
          onPress={item.onPressCallback}
        />
      );
    }
    return (
      <List.Item
        title={item.text}
        left={getItemIcon}
        onPress={item.onPressCallback}
      />
    );
  };

  /**
   * Gets a card, depending on the given item's id
   *
   * @param item The item to show
   * @return {*}
   */
  getMainCard = ({item}: {item: {id: string}}) => {
    switch (item.id) {
      case 'app':
        return this.getAppCard();
      case 'team':
        return this.getTeamCard();
      case 'thanks':
        return this.getThanksCard();
      case 'techno':
        return this.getTechnoCard();
      default:
        return null;
    }
  };

  onDialogDismiss = () => {
    this.setState({dialogVisible: false});
  };

  /**
   * Extracts a key from the given item
   *
   * @param item The item to extract the key from
   * @return {string} The extracted key
   */
  keyExtractor = (item: ListItemType): string => item.icon;

  render() {
    const {state} = this;
    return (
      <View
        style={{
          height: '100%',
        }}>
        <CollapsibleFlatList
          style={{padding: 5}}
          data={this.dataOrder}
          renderItem={this.getMainCard}
        />
        <OptionsDialog
          visible={state.dialogVisible}
          title={state.dialogTitle}
          message={state.dialogMessage}
          buttons={state.dialogButtons}
          onDismiss={this.onDialogDismiss}
        />
      </View>
    );
  }
}

export default AboutScreen;

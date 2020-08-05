// @flow

import * as React from 'react';
import {FlatList, Linking, Platform} from 'react-native';
import i18n from 'i18n-js';
import {Avatar, Card, List, Title, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import packageJson from '../../../package.json';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import APP_LOGO from '../../../assets/android.icon.png';

type ListItemType = {
  onPressCallback: () => void,
  icon: string,
  text: string,
  showChevron: boolean,
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
  authorMail:
    'mailto:vergnet@etud.insa-toulouse.fr?' +
    'subject=' +
    'Application Amicale INSA Toulouse' +
    '&body=' +
    'Coucou !\n\n',
  authorLinkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
  yohanMail:
    'mailto:ysimard@etud.insa-toulouse.fr?' +
    'subject=' +
    'Application Amicale INSA Toulouse' +
    '&body=' +
    'Coucou !\n\n',
  yohanLinkedin: 'https://www.linkedin.com/in/yohan-simard',
  react: 'https://facebook.github.io/react-native/',
  meme: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

type PropsType = {
  navigation: StackNavigationProp,
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
class AboutScreen extends React.Component<PropsType> {
  /**
   * Data to be displayed in the app card
   */
  appData = [
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
   * Data to be displayed in the author card
   */
  authorData = [
    {
      onPressCallback: () => {
        openWebLink(links.meme);
      },
      icon: 'account-circle',
      text: 'Arnaud VERGNET',
      showChevron: false,
    },
    {
      onPressCallback: () => {
        openWebLink(links.authorMail);
      },
      icon: 'email',
      text: i18n.t('screens.about.authorMail'),
      showChevron: true,
    },
    {
      onPressCallback: () => {
        openWebLink(links.authorLinkedin);
      },
      icon: 'linkedin',
      text: 'Linkedin',
      showChevron: true,
    },
  ];

  /**
   * Data to be displayed in the additional developer card
   */
  additionalDevData = [
    {
      onPressCallback: () => {},
      icon: 'account',
      text: 'Yohan SIMARD',
      showChevron: false,
    },
    {
      onPressCallback: () => {
        openWebLink(links.yohanMail);
      },
      icon: 'email',
      text: i18n.t('screens.about.authorMail'),
      showChevron: true,
    },
    {
      onPressCallback: () => {
        openWebLink(links.yohanLinkedin);
      },
      icon: 'linkedin',
      text: 'Linkedin',
      showChevron: true,
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
      id: 'techno',
    },
  ];

  /**
   * Gets the app card showing information and links about the app.
   *
   * @return {*}
   */
  getAppCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title="Campus"
          subtitle={packageJson.version}
          left={({size}: {size: number}): React.Node => (
            <Avatar.Image
              size={size}
              source={APP_LOGO}
              style={{backgroundColor: 'transparent'}}
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
  getTeamCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.team')}
          left={({size, color}: {size: number, color: string}): React.Node => (
            <Avatar.Icon size={size} color={color} icon="account-multiple" />
          )}
        />
        <Card.Content>
          <Title>{i18n.t('screens.about.author')}</Title>
          <FlatList
            data={this.authorData}
            keyExtractor={this.keyExtractor}
            listKey="1"
            renderItem={this.getCardItem}
          />
          <Title>{i18n.t('screens.about.additionalDev')}</Title>
          <FlatList
            data={this.additionalDevData}
            keyExtractor={this.keyExtractor}
            listKey="2"
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
  getTechnoCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Content>
          <Title>{i18n.t('screens.about.technologies')}</Title>
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
  static getChevronIcon({
    size,
    color,
  }: {
    size: number,
    color: string,
  }): React.Node {
    return <List.Icon size={size} color={color} icon="chevron-right" />;
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
    {size, color}: {size: number, color: string},
  ): React.Node {
    return <List.Icon size={size} color={color} icon={item.icon} />;
  }

  /**
   * Gets a clickable card item to be rendered inside a card.
   *
   * @returns {*}
   */
  getCardItem = ({item}: {item: ListItemType}): React.Node => {
    const getItemIcon = (props: {size: number, color: string}): React.Node =>
      AboutScreen.getItemIcon(item, props);
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
  getMainCard = ({item}: {item: {id: string}}): React.Node => {
    switch (item.id) {
      case 'app':
        return this.getAppCard();
      case 'team':
        return this.getTeamCard();
      case 'techno':
        return this.getTechnoCard();
      default:
        return null;
    }
  };

  /**
   * Extracts a key from the given item
   *
   * @param item The item to extract the key from
   * @return {string} The extracted key
   */
  keyExtractor = (item: ListItemType): string => item.icon;

  render(): React.Node {
    return (
      <CollapsibleFlatList
        style={{padding: 5}}
        data={this.dataOrder}
        renderItem={this.getMainCard}
      />
    );
  }
}

export default withTheme(AboutScreen);

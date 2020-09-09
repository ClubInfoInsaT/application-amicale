// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Avatar, Card, List, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import packageJson from '../../../package.json';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import APP_LOGO from '../../../assets/android.icon.round.png';
import type {
  CardTitleIconPropsType,
  ListIconPropsType,
} from '../../constants/PaperStyles';
import OptionsDialog from '../../components/Dialogs/OptionsDialog';
import type {OptionsDialogButtonType} from '../../components/Dialogs/OptionsDialog';

type ListItemType = {
  onPressCallback: () => void,
  icon: string,
  text: string,
  showChevron: boolean,
};

type MemberItemType = {
  name: string,
  message: string,
  icon: string,
  trollLink?: string,
  linkedin?: string,
  mail?: string,
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
  navigation: StackNavigationProp,
};

type StateType = {
  dialogVisible: boolean,
  dialogTitle: string,
  dialogMessage: string,
  dialogButtons: Array<OptionsDialogButtonType>,
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link: string) {
  Linking.openURL(link);
}

/**
 * Object containing data relative to major contributors
 */
const majorContributors: {[key: string]: MemberItemType} = {
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
    mail: 'mailto:ysimard@etud.insa-toulouse.fr?' +
      'subject=' +
      'Application Amicale INSA Toulouse' +
      '&body=' +
      'Coucou !\n\n',
  },
};

/**
 * Object containing data relative to users who helped during development
 */
const helpfulUsers: {[key: string]: MemberItemType} = {
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
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
class AboutScreen extends React.Component<PropsType, StateType> {

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
        this.onContributorListItemPress(majorContributors.arnaud);
      },
      icon: majorContributors.arnaud.icon,
      text: majorContributors.arnaud.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(majorContributors.yohan);
      },
      icon: majorContributors.yohan.icon,
      text: majorContributors.yohan.name,
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
        this.onContributorListItemPress(helpfulUsers.beranger);
      },
      icon: helpfulUsers.beranger.icon,
      text: helpfulUsers.beranger.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(helpfulUsers.celine);
      },
      icon: helpfulUsers.celine.icon,
      text: helpfulUsers.celine.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(helpfulUsers.damien);
      },
      icon: helpfulUsers.damien.icon,
      text: helpfulUsers.damien.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(helpfulUsers.titouan);
      },
      icon: helpfulUsers.titouan.icon,
      text: helpfulUsers.titouan.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onContributorListItemPress(helpfulUsers.theo);
      },
      icon: helpfulUsers.theo.icon,
      text: helpfulUsers.theo.name,
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
    const dialogBtn = [
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
  getAppCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title="Campus"
          subtitle={packageJson.version}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Image
              size={iconProps.size}
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
  getTeamCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.team')}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
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
  getThanksCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.thanks')}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
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
  getTechnoCard(): React.Node {
    return (
      <Card style={{marginBottom: 10}}>
        <Card.Title
          title={i18n.t('screens.about.technologies')}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
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
  static getChevronIcon(props: ListIconPropsType): React.Node {
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
  static getItemIcon(item: ListItemType, props: ListIconPropsType): React.Node {
    return (
      <List.Icon color={props.color} style={props.style} icon={item.icon} />
    );
  }

  /**
   * Gets a clickable card item to be rendered inside a card.
   *
   * @returns {*}
   */
  getCardItem = ({item}: {item: ListItemType}): React.Node => {
    const getItemIcon = (props: ListIconPropsType): React.Node =>
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

  render(): React.Node {
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

export default withTheme(AboutScreen);

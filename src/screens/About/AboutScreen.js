// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Avatar, Card, List, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {Modalize} from "react-native-modalize";
import packageJson from '../../../package.json';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import APP_LOGO from '../../../assets/android.icon.round.png';
import type {
  CardTitleIconPropsType,
  ListIconPropsType,
} from '../../constants/PaperStyles';
import OptionsDialog from "../../components/Dialogs/OptionsDialog";
import type {OptionsDialogButtonType} from "../../components/Dialogs/OptionsDialog";

type ListItemType = {
  onPressCallback: () => void,
  icon: string,
  text: string,
  showChevron: boolean,
};

type AthorsItemType = {
  name: string,
  message: string,
  btnTrool: OptionsDialogButtonType,
  btnLinkedin: OptionsDialogButtonType,
  btnMail: OptionsDialogButtonType,
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
  arnaudMail:
    'mailto:vergnet@etud.insa-toulouse.fr?' +
    'subject=' +
    'Application Amicale INSA Toulouse' +
    '&body=' +
    'Coucou !\n\n',
  arnaudLinkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
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
  modalRef: Modalize | null;

  /**
   * Data team
   */
  teamUsers = {
    arnaud: {
      name: 'Arnaud VERGNET',
      message: 'C vrément tro 1 bg !!',
      icon: 'account-circle',
      btnTrool: {
          title: 'SWAG',
          onPress: () => {
            openWebLink(links.meme);
          },
        },
      btnLinkedin: {
        title: 'Linkedin',
        onPress: () => {
          openWebLink(links.arnaudMail);
        },
      },
      btnMail: {
        title: i18n.t('screens.about.authorMail'),
        onPress: () => {
          openWebLink(links.arnaudLinkedin);
        },
      },
    },
    yohan: {
      name: 'Yohan Simard',
      message: 'Correction de quelques bugs',
      icon: 'account-circle',
      btnTrool: null,
      btnLinkedin: {
        title: 'Linkedin',
        onPress: () => {
          openWebLink(links.yohanLinkedin);
        },
      },
      btnMail: {
        title: i18n.t('screens.about.authorMail'),
        onPress: () => {
          openWebLink(links.yohanMail);
        },
      },
    },
  };

  /**
   * Data thanks
   */
  thanksUsers = {
    beranger: {
      name: 'Béranger Quintana Y Arciosana',
      message: 'Étudiant en AE (2020) et Président de l’Amicale au moment de la création et du lancement du projet. L’application, c’était son idée. Il a beaucoup aidé pour trouver des bugs, de nouvelles fonctionnalités et faire de la com.',
      icon: 'account-circle',
      btnTrool: null,
      btnLinkedin: null,
      btnMail: null,
    },
    celine: {
      name: 'Céline Tassin',
      message: 'Étudiante en GPE (2020). Sans elle, tout serait moins mignon. Elle a aidé pour écrire le texte, faire de la com, et aussi à créer la mascotte 🦊.',
      icon: 'account-circle',
      btnTrool: null,
      btnLinkedin: null,
      btnMail: null,
    },
    damien: {
      name: 'Damien Molina',
      message: 'Étudiant en IR (2020) et créateur de la dernière version du site de l’Amicale. Grâce à son aide, intégrer les services de l’Amicale à l’application a été très simple.',
      icon: 'account-circle',
      btnTrool: null,
      btnLinkedin: null,
      btnMail: null,
    },
    titouan: {
      name: 'Titouan Labourdette',
      message: 'Étudiant en AE (2020) et Président de l’Amicale au moment de la création et du lancement du projet. L’application, c’était son idée. Il a beaucoup aidé pour trouver des bugs, de nouvelles fonctionnalités et faire de la com.',
      icon: 'account-circle',
      btnTrool: null,
      btnLinkedin: null,
      btnMail: null,
    },
    theo: {
      name: 'Théo Tami',
      message: 'Étudiant en IR (2020). Il a beaucoup aidé pour trouver des bugs et proposer des nouvelles fonctionnalités.',
      icon: 'account-circle',
      btnTrool: null,
      btnLinkedin: null,
      btnMail: null,
    },
  };

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
   * Data to be displayed in the additional developer card
   */
  teamData = [
    {
      onPressCallback: () => {
        this.onListItemPress(this.teamUsers.arnaud);
      },
      icon: this.teamUsers.arnaud.icon,
      text: this.teamUsers.arnaud.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onListItemPress(this.teamUsers.yohan);
      },
      icon: this.teamUsers.yohan.icon,
      text: this.teamUsers.yohan.name,
      showChevron: false,
    },
  ];

  /**
   * Data to be displayed in the thanks card
   */
  thanksData = [
    {
      onPressCallback: () => {
        this.onListItemPress(this.thanksUsers.beranger);
      },
      icon: this.thanksUsers.beranger.icon,
      text: this.thanksUsers.beranger.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onListItemPress(this.thanksUsers.celine);
      },
      icon: this.thanksUsers.celine.icon,
      text: this.thanksUsers.celine.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onListItemPress(this.thanksUsers.damien);
      },
      icon: this.thanksUsers.damien.icon,
      text: this.thanksUsers.damien.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onListItemPress(this.thanksUsers.titouan);
      },
      icon: this.thanksUsers.titouan.icon,
      text: this.thanksUsers.titouan.name,
      showChevron: false,
    },
    {
      onPressCallback: () => {
        this.onListItemPress(this.thanksUsers.theo);
      },
      icon: this.thanksUsers.theo.icon,
      text: this.thanksUsers.theo.name,
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
      onDialogDismiss: () => {
        this.setState({dialogVisible: false});
      },
    };
  }

  /**
   * Callback used when clicking an article in the list.
   * It opens the modal to show detailed information about the article
   *
   * @param user TODO
   */
  onListItemPress(user: AthorsItemType) {
    const dialogBtn: Array<OptionsDialogButtonType> = [
      {
        title: 'OK',
        onPress: () => {
          this.onDialogDismiss();
        },
      }
    ];
    if(user.btnMail != null) {
      dialogBtn.push(user.btnMail);
    }
    if(user.btnLinkedin != null) {
      dialogBtn.push(user.btnLinkedin);
    }
    if(user.btnTrool != null) {
      dialogBtn.push(user.btnTrool);
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
   * Gets the thanks card showing information and links about the team TODO
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
                  <Avatar.Icon size={iconProps.size} icon="build" />
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
            onDismiss={state.onDialogDismiss}
        />
      </View>
    );
  }
}

export default withTheme(AboutScreen);

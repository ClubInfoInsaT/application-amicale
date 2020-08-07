// @flow

import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Paragraph,
  withTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import AuthenticatedScreen from '../../components/Amicale/AuthenticatedScreen';
import LogoutDialog from '../../components/Amicale/LogoutDialog';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import CardList from '../../components/Lists/CardList/CardList';
import type {CustomThemeType} from '../../managers/ThemeManager';
import AvailableWebsites from '../../constants/AvailableWebsites';
import Mascot, {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import ServicesManager, {SERVICES_KEY} from '../../managers/ServicesManager';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import type {ServiceItemType} from '../../managers/ServicesManager';
import type {
  CardTitleIconPropsType,
  ListIconPropsType,
} from '../../constants/PaperStyles';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
};

type StateType = {
  dialogVisible: boolean,
};

type ClubType = {
  id: number,
  name: string,
  is_manager: boolean,
};

type ProfileDataType = {
  first_name: string,
  last_name: string,
  email: string,
  birthday: string,
  phone: string,
  branch: string,
  link: string,
  validity: boolean,
  clubs: Array<ClubType>,
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  editButton: {
    marginLeft: 'auto',
  },
});

class ProfileScreen extends React.Component<PropsType, StateType> {
  data: ProfileDataType;

  flatListData: Array<{id: string}>;

  amicaleDataset: Array<ServiceItemType>;

  constructor(props: PropsType) {
    super(props);
    this.flatListData = [{id: '0'}, {id: '1'}, {id: '2'}, {id: '3'}];
    const services = new ServicesManager(props.navigation);
    this.amicaleDataset = services.getAmicaleServices([SERVICES_KEY.PROFILE]);
    this.state = {
      dialogVisible: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: this.getHeaderButton,
    });
  }

  /**
   * Gets the logout header button
   *
   * @returns {*}
   */
  getHeaderButton = (): React.Node => (
    <MaterialHeaderButtons>
      <Item
        title="logout"
        iconName="logout"
        onPress={this.showDisconnectDialog}
      />
    </MaterialHeaderButtons>
  );

  /**
   * Gets the main screen component with the fetched data
   *
   * @param data The data fetched from the server
   * @returns {*}
   */
  getScreen = (data: Array<ProfileDataType | null>): React.Node => {
    const {dialogVisible} = this.state;
    const {navigation} = this.props;
    // eslint-disable-next-line prefer-destructuring
    if (data[0] != null) this.data = data[0];

    return (
      <View style={{flex: 1}}>
        <CollapsibleFlatList
          renderItem={this.getRenderItem}
          data={this.flatListData}
        />
        <LogoutDialog
          navigation={navigation}
          visible={dialogVisible}
          onDismiss={this.hideDisconnectDialog}
        />
      </View>
    );
  };

  getRenderItem = ({item}: {item: {id: string}}): React.Node => {
    switch (item.id) {
      case '0':
        return this.getWelcomeCard();
      case '1':
        return this.getPersonalCard();
      case '2':
        return this.getClubCard();
      default:
        return this.getMembershipCar();
    }
  };

  /**
   * Gets the list of services available with the Amicale account
   *
   * @returns {*}
   */
  getServicesList(): React.Node {
    return <CardList dataset={this.amicaleDataset} isHorizontal />;
  }

  /**
   * Gets a card welcoming the user to his account
   *
   * @returns {*}
   */
  getWelcomeCard(): React.Node {
    const {navigation} = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.profile.welcomeTitle', {
            name: this.data.first_name,
          })}
          left={(): React.Node => (
            <Mascot
              style={{
                width: 60,
              }}
              emotion={MASCOT_STYLE.COOL}
              animated
              entryAnimation={{
                animation: 'bounceIn',
                duration: 1000,
              }}
            />
          )}
          titleStyle={{marginLeft: 10}}
        />
        <Card.Content>
          <Divider />
          <Paragraph>{i18n.t('screens.profile.welcomeDescription')}</Paragraph>
          {this.getServicesList()}
          <Paragraph>{i18n.t('screens.profile.welcomeFeedback')}</Paragraph>
          <Divider />
          <Card.Actions>
            <Button
              icon="bug"
              mode="contained"
              onPress={() => {
                navigation.navigate('feedback');
              }}
              style={styles.editButton}>
              {i18n.t('screens.feedback.homeButtonTitle')}
            </Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets the given field value.
   * If the field does not have a value, returns a placeholder text
   *
   * @param field The field to get the value from
   * @return {*}
   */
  static getFieldValue(field: ?string): string {
    return field != null ? field : i18n.t('screens.profile.noData');
  }

  /**
   * Gets a list item showing personal information
   *
   * @param field The field to display
   * @param icon The icon to use
   * @return {*}
   */
  getPersonalListItem(field: ?string, icon: string): React.Node {
    const {theme} = this.props;
    const title = field != null ? ProfileScreen.getFieldValue(field) : ':(';
    const subtitle = field != null ? '' : ProfileScreen.getFieldValue(field);
    return (
      <List.Item
        title={title}
        description={subtitle}
        left={(props: ListIconPropsType): React.Node => (
          <List.Icon
            style={props.style}
            icon={icon}
            color={field != null ? props.color : theme.colors.textDisabled}
          />
        )}
      />
    );
  }

  /**
   * Gets a card containing user personal information
   *
   * @return {*}
   */
  getPersonalCard(): React.Node {
    const {theme, navigation} = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={`${this.data.first_name} ${this.data.last_name}`}
          subtitle={this.data.email}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon
              size={iconProps.size}
              icon="account"
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>
          <Divider />
          <List.Section>
            <List.Subheader>
              {i18n.t('screens.profile.personalInformation')}
            </List.Subheader>
            {this.getPersonalListItem(this.data.birthday, 'cake-variant')}
            {this.getPersonalListItem(this.data.phone, 'phone')}
            {this.getPersonalListItem(this.data.email, 'email')}
            {this.getPersonalListItem(this.data.branch, 'school')}
          </List.Section>
          <Divider />
          <Card.Actions>
            <Button
              icon="account-edit"
              mode="contained"
              onPress={() => {
                navigation.navigate('website', {
                  host: AvailableWebsites.websites.AMICALE,
                  path: this.data.link,
                  title: i18n.t('screens.websites.amicale'),
                });
              }}
              style={styles.editButton}>
              {i18n.t('screens.profile.editInformation')}
            </Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets a cars containing clubs the user is part of
   *
   * @return {*}
   */
  getClubCard(): React.Node {
    const {theme} = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.profile.clubs')}
          subtitle={i18n.t('screens.profile.clubsSubtitle')}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon
              size={iconProps.size}
              icon="account-group"
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>
          <Divider />
          {this.getClubList(this.data.clubs)}
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets a card showing if the user has payed his membership
   *
   * @return {*}
   */
  getMembershipCar(): React.Node {
    const {theme} = this.props;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.profile.membership')}
          subtitle={i18n.t('screens.profile.membershipSubtitle')}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon
              size={iconProps.size}
              icon="credit-card"
              color={theme.colors.primary}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>
          <List.Section>
            {this.getMembershipItem(this.data.validity)}
          </List.Section>
        </Card.Content>
      </Card>
    );
  }

  /**
   * Gets the item showing if the user has payed his membership
   *
   * @return {*}
   */
  getMembershipItem(state: boolean): React.Node {
    const {theme} = this.props;
    return (
      <List.Item
        title={
          state
            ? i18n.t('screens.profile.membershipPayed')
            : i18n.t('screens.profile.membershipNotPayed')
        }
        left={(props: ListIconPropsType): React.Node => (
          <List.Icon
            style={props.style}
            color={state ? theme.colors.success : theme.colors.danger}
            icon={state ? 'check' : 'close'}
          />
        )}
      />
    );
  }

  /**
   * Gets a list item for the club list
   *
   * @param item The club to render
   * @return {*}
   */
  getClubListItem = ({item}: {item: ClubType}): React.Node => {
    const {theme} = this.props;
    const onPress = () => {
      this.openClubDetailsScreen(item.id);
    };
    let description = i18n.t('screens.profile.isMember');
    let icon = (props: ListIconPropsType): React.Node => (
      <List.Icon color={props.color} style={props.style} icon="chevron-right" />
    );
    if (item.is_manager) {
      description = i18n.t('screens.profile.isManager');
      icon = (props: ListIconPropsType): React.Node => (
        <List.Icon
          style={props.style}
          icon="star"
          color={theme.colors.primary}
        />
      );
    }
    return (
      <List.Item
        title={item.name}
        description={description}
        left={icon}
        onPress={onPress}
      />
    );
  };

  /**
   * Renders the list of clubs the user is part of
   *
   * @param list The club list
   * @return {*}
   */
  getClubList(list: Array<ClubType>): React.Node {
    list.sort(this.sortClubList);
    return (
      <FlatList
        renderItem={this.getClubListItem}
        keyExtractor={this.clubKeyExtractor}
        data={list}
      />
    );
  }

  clubKeyExtractor = (item: ClubType): string => item.name;

  sortClubList = (a: ClubType): number => (a.is_manager ? -1 : 1);

  showDisconnectDialog = () => {
    this.setState({dialogVisible: true});
  };

  hideDisconnectDialog = () => {
    this.setState({dialogVisible: false});
  };

  /**
   * Opens the club details screen for the club of given ID
   * @param id The club's id to open
   */
  openClubDetailsScreen(id: number) {
    const {navigation} = this.props;
    navigation.navigate('club-information', {clubId: id});
  }

  render(): React.Node {
    const {navigation} = this.props;
    return (
      <AuthenticatedScreen
        navigation={navigation}
        requests={[
          {
            link: 'user/profile',
            params: {},
            mandatory: true,
          },
        ]}
        renderFunction={this.getScreen}
      />
    );
  }
}

export default withTheme(ProfileScreen);

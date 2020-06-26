// @flow

import * as React from 'react';
import {Animated, FlatList, StyleSheet, View} from "react-native";
import {Avatar, Button, Card, Divider, List, Paragraph, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import i18n from 'i18n-js';
import LogoutDialog from "../../components/Amicale/LogoutDialog";
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {Collapsible} from "react-navigation-collapsible";
import {withCollapsible} from "../../utils/withCollapsible";
import type {cardList} from "../../components/Lists/CardList/CardList";
import CardList from "../../components/Lists/CardList/CardList";

type Props = {
    navigation: Object,
    theme: Object,
    collapsibleStack: Collapsible,
}

type State = {
    dialogVisible: boolean,
}

const CLUBS_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Clubs.png";
const VOTE_IMAGE = "https://etud.insa-toulouse.fr/~amicale_app/images/Vote.png";

const ICON_AMICALE = require('../../../assets/amicale.png');

class ProfileScreen extends React.Component<Props, State> {

    state = {
        dialogVisible: false,
    };

    data: Object;

    flatListData: Array<Object>;
    amicaleDataset: cardList;

    constructor() {
        super();
        this.flatListData = [
            {id: '0'},
            {id: '1'},
            {id: '2'},
            {id: '3'},
        ]
        this.amicaleDataset = [
            {
                title: i18n.t('screens.clubsAbout'),
                subtitle: i18n.t('servicesScreen.descriptions.clubs'),
                image: CLUBS_IMAGE,
                onPress: () => this.props.navigation.navigate("club-list"),
            },
            {
                title: i18n.t('screens.vote'),
                subtitle: i18n.t('servicesScreen.descriptions.vote'),
                image: VOTE_IMAGE,
                onPress: () => this.props.navigation.navigate("vote"),
            },
            {
                title: i18n.t('screens.amicaleWebsite'),
                subtitle: i18n.t('servicesScreen.descriptions.amicaleWebsite'),
                image: ICON_AMICALE,
                onPress: () => this.props.navigation.navigate("amicale-website"),
            },
        ];
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getHeaderButton,
        });
    }

    showDisconnectDialog = () => this.setState({dialogVisible: true});

    hideDisconnectDialog = () => this.setState({dialogVisible: false});

    getHeaderButton = () => <MaterialHeaderButtons>
        <Item title="logout" iconName="logout" onPress={this.showDisconnectDialog}/>
    </MaterialHeaderButtons>;

    getScreen = (data: Object) => {
        this.data = data[0];
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <View style={{flex: 1}}>
                <Animated.FlatList
                    renderItem={this.getRenderItem}
                    data={this.flatListData}
                    // Animations
                    onScroll={onScroll}
                    contentContainerStyle={{
                        paddingTop: containerPaddingTop,
                        paddingBottom: CustomTabBar.TAB_BAR_HEIGHT,
                        minHeight: '100%'
                    }}
                    scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
                />
                <LogoutDialog
                    {...this.props}
                    visible={this.state.dialogVisible}
                    onDismiss={this.hideDisconnectDialog}
                />
            </View>
        )
    };

    getRenderItem = ({item}: Object) => {
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

    getServicesList() {
        return (
            <CardList
                dataset={this.amicaleDataset}
                isHorizontal={true}
            />
        );
    }

    getWelcomeCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("profileScreen.welcomeTitle", {name: this.data.first_name})}
                    left={(props) => <Avatar.Image
                        size={64}
                        source={ICON_AMICALE}
                        style={{backgroundColor: 'transparent',}}
                    />}
                    titleStyle={{marginLeft: 10}}
                />
                <Card.Content>
                    <Divider/>
                    <Paragraph>
                        {i18n.t("profileScreen.welcomeDescription")}
                    </Paragraph>
                    {this.getServicesList()}
                    <Paragraph>
                        {i18n.t("profileScreen.welcomeFeedback")}
                    </Paragraph>
                    <Divider/>
                    <Card.Actions>
                        <Button
                            icon="bug"
                            mode="contained"
                            onPress={() => this.props.navigation.navigate('feedback')}
                            style={styles.editButton}>
                            {i18n.t("feedbackScreen.homeButtonTitle")}
                        </Button>
                    </Card.Actions>
                </Card.Content>
            </Card>
        );
    }

    /**
     * Checks if the given field is available
     *
     * @param field The field to check
     * @return {boolean}
     */
    isFieldAvailable(field: ?string) {
        return field !== null;
    }

    /**
     * Gets the given field value.
     * If the field does not have a value, returns a placeholder text
     *
     * @param field The field to get the value from
     * @return {*}
     */
    getFieldValue(field: ?string) {
        return this.isFieldAvailable(field)
            ? field
            : i18n.t("profileScreen.noData");
    }

    /**
     * Gets a list item showing personal information
     *
     * @param field The field to display
     * @param icon The icon to use
     * @return {*}
     */
    getPersonalListItem(field: ?string, icon: string) {
        let title = this.isFieldAvailable(field) ? this.getFieldValue(field) : ':(';
        let subtitle = this.isFieldAvailable(field) ? '' : this.getFieldValue(field);
        return (
            <List.Item
                title={title}
                description={subtitle}
                left={props => <List.Icon
                    {...props}
                    icon={icon}
                    color={this.isFieldAvailable(field) ? undefined : this.props.theme.colors.textDisabled}
                />}
            />
        );
    }

    /**
     * Gets a card containing user personal information
     *
     * @return {*}
     */
    getPersonalCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={this.data.first_name + ' ' + this.data.last_name}
                    subtitle={this.data.email}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon="account"
                        color={this.props.theme.colors.primary}
                        style={styles.icon}
                    />}
                />
                <Card.Content>
                    <Divider/>
                    <List.Section>
                        <List.Subheader>{i18n.t("profileScreen.personalInformation")}</List.Subheader>
                        {this.getPersonalListItem(this.data.birthday, "cake-variant")}
                        {this.getPersonalListItem(this.data.phone, "phone")}
                        {this.getPersonalListItem(this.data.email, "email")}
                        {this.getPersonalListItem(this.data.branch, "school")}
                    </List.Section>
                    <Divider/>
                    <Card.Actions>
                        <Button
                            icon="account-edit"
                            mode="contained"
                            onPress={() => this.props.navigation.navigate('amicale-website', {path: this.data.link})}
                            style={styles.editButton}>
                            {i18n.t("profileScreen.editInformation")}
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
    getClubCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("profileScreen.clubs")}
                    subtitle={i18n.t("profileScreen.clubsSubtitle")}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon="account-group"
                        color={this.props.theme.colors.primary}
                        style={styles.icon}
                    />}
                />
                <Card.Content>
                    <Divider/>
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
    getMembershipCar() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("profileScreen.membership")}
                    subtitle={i18n.t("profileScreen.membershipSubtitle")}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon="credit-card"
                        color={this.props.theme.colors.primary}
                        style={styles.icon}
                    />}
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
    getMembershipItem(state: boolean) {
        return (
            <List.Item
                title={state ? i18n.t("profileScreen.membershipPayed") : i18n.t("profileScreen.membershipNotPayed")}
                left={props => <List.Icon
                    {...props}
                    color={state ? this.props.theme.colors.success : this.props.theme.colors.danger}
                    icon={state ? 'check' : 'close'}
                />}
            />
        );
    }

    /**
     * Opens the club details screen for the club of given ID
     * @param id The club's id to open
     */
    openClubDetailsScreen(id: number) {
        this.props.navigation.navigate("club-information", {clubId: id});
    }

    /**
     * Gets a list item for the club list
     *
     * @param item The club to render
     * @return {*}
     */
    clubListItem = ({item}: Object) => {
        const onPress = () => this.openClubDetailsScreen(item.id);
        let description = i18n.t("profileScreen.isMember");
        let icon = (props) => <List.Icon {...props} icon="chevron-right"/>;
        if (item.is_manager) {
            description = i18n.t("profileScreen.isManager");
            icon = (props) => <List.Icon {...props} icon="star" color={this.props.theme.colors.primary}/>;
        }
        return <List.Item
            title={item.name}
            description={description}
            left={icon}
            onPress={onPress}
        />;
    };

    clubKeyExtractor = (item: Object) => item.name;

    sortClubList = (a: Object, b: Object) => a.is_manager ? -1 : 1;

    /**
     * Renders the list of clubs the user is part of
     *
     * @param list The club list
     * @return {*}
     */
    getClubList(list: Array<Object>) {
        list.sort(this.sortClubList);
        return (
            //$FlowFixMe
            <FlatList
                renderItem={this.clubListItem}
                keyExtractor={this.clubKeyExtractor}
                data={list}
            />
        );
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                requests={[
                    {
                        link: 'user/profile',
                        params: {},
                        mandatory: true,
                    }
                ]}
                renderFunction={this.getScreen}
            />
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
    },
    icon: {
        backgroundColor: 'transparent'
    },
    editButton: {
        marginLeft: 'auto'
    }

});

export default withCollapsible(withTheme(ProfileScreen));

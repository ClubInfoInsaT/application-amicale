// @flow

import * as React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {Avatar, Button, Card, Divider, List, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/Amicale/AuthenticatedScreen";
import {openBrowser} from "../../utils/WebBrowser";
import HeaderButton from "../../components/Custom/HeaderButton";
import i18n from 'i18n-js';
import LogoutDialog from "../../components/Amicale/LogoutDialog";

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {
    dialogVisible: boolean,
}

class ProfileScreen extends React.Component<Props, State> {

    state = {
        dialogVisible: false,
    };

    data: Object;

    flatListData: Array<Object>;

    constructor() {
        super();
        this.flatListData = [
            {id: '0'},
            {id: '1'},
            {id: '2'},
        ]
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getHeaderButton,
        });
    }

    showDisconnectDialog = () => this.setState({dialogVisible: true});

    hideDisconnectDialog = () => this.setState({dialogVisible: false});

    getHeaderButton = () => <HeaderButton icon={'logout'} onPress={this.showDisconnectDialog}/>;

    getScreen = (data: Object) => {
        this.data = data[0];
        return (
            <View>
                {/*$FlowFixMe*/}
                <FlatList
                    renderItem={this.getRenderItem}
                    data={this.flatListData}
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
                return this.getPersonalCard();
            case '1':
                return this.getClubCard();
            default:
                return this.getMembershipCar();
        }
    };

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
                            onPress={() => openBrowser(this.data.link, this.props.theme.colors.primary)}
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

export default withTheme(ProfileScreen);

// @flow

import * as React from 'react';
import {FlatList, ScrollView, StyleSheet} from "react-native";
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

    colors: Object;

    data: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    componentDidMount() {
        const rightButton = this.getHeaderButtons.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
    }

    showDisconnectDialog = () => this.setState({dialogVisible: true});

    hideDisconnectDialog = () => this.setState({dialogVisible: false});

    getHeaderButtons() {
        return <HeaderButton icon={'logout'} onPress={this.showDisconnectDialog}/>;
    }

    getScreen = (data: Object) => {
        this.data = data[0];
        return (
            <ScrollView>
                {this.getPersonalCard()}
                {this.getClubCard()}
                {this.getMembershipCar()}
                <LogoutDialog
                    {...this.props}
                    visible={this.state.dialogVisible}
                    onDismiss={this.hideDisconnectDialog}
                />
            </ScrollView>
        )
    };

    getPersonalCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={this.data.first_name + ' ' + this.data.last_name}
                    subtitle={this.data.email}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon="account"
                        color={this.colors.primary}
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
                            onPress={() => openBrowser(this.data.link, this.colors.primary)}
                            style={styles.editButton}>
                            {i18n.t("profileScreen.editInformation")}
                        </Button>
                    </Card.Actions>
                </Card.Content>
            </Card>
        );
    }

    getClubCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("profileScreen.clubs")}
                    subtitle={i18n.t("profileScreen.clubsSubtitle")}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon="account-group"
                        color={this.colors.primary}
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

    getMembershipCar() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("profileScreen.membership")}
                    subtitle={i18n.t("profileScreen.membershipSubtitle")}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon="credit-card"
                        color={this.colors.primary}
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

    getClubList(list: Array<string>) {
        let dataset = [];
        for (let i = 0; i < list.length; i++) {
            dataset.push({name: list[i]});
        }
        return (
            <FlatList
                renderItem={({item}) =>
                    <List.Item
                        title={item.name}
                        left={props => <List.Icon {...props} icon="chevron-right"/>}
                    />
                }
                keyExtractor={item => item.name}
                data={dataset}
            />
        );
    }

    getMembershipItem(state: boolean) {
        return (
            <List.Item
                title={state ? i18n.t("profileScreen.membershipPayed") : i18n.t("profileScreen.membershipNotPayed")}
                left={props => <List.Icon
                    {...props}
                    color={state ? this.colors.success : this.colors.danger}
                    icon={state ? 'check' : 'close'}
                />}
            />
        );
    }

    isFieldAvailable(field: ?string) {
        return field !== null;
    }

    getFieldValue(field: ?string) {
        return this.isFieldAvailable(field)
            ? field
            : i18n.t("profileScreen.noData");
    }

    getFieldColor(field: ?string) {
        return this.isFieldAvailable(field)
            ? this.colors.text
            : this.colors.textDisabled;
    }

    getPersonalListItem(field: ?string, icon: string) {
        return (
            <List.Item
                title={this.getFieldValue(field)}
                left={props => <List.Icon
                    {...props}
                    icon={icon}
                    color={this.getFieldColor(field)}
                />}
                titleStyle={{color: this.getFieldColor(field)}}
            />
        );
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                links={[
                    {
                        link: 'user/profile',
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

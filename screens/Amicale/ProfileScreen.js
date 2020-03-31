import * as React from 'react';
import {FlatList, StyleSheet} from "react-native";
import {Avatar, Button, Card, Divider, List, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/AuthenticatedScreen";
import {openBrowser} from "../../utils/WebBrowser";
import ConnectionManager from "../../managers/ConnectionManager";
import HeaderButton from "../../components/HeaderButton";
import i18n from 'i18n-js';

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {}

class ProfileScreen extends React.Component<Props, State> {

    state = {};

    colors: Object;

    data: Object;

    flatListData: Array<Object>;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.onClickDisconnect = this.onClickDisconnect.bind(this);
        this.flatListData = [
            {id: 0},
            {id: 1},
            {id: 2},
        ]
    }

    componentDidMount() {
        const rightButton = this.getHeaderButtons.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
    }

    getHeaderButtons() {
        return <HeaderButton icon={'logout'} onPress={this.onClickDisconnect}/>;
    }

    onClickDisconnect() {
        ConnectionManager.getInstance().disconnect()
            .then(() => {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{name: 'Main'}],
                });
            });
    }

    getScreen(data: Object) {
        this.data = data;
        return (
            <FlatList
                renderItem={item => this.getRenderItem(item)}
                keyExtractor={item => item.id}
                data={this.flatListData}
            />
        )
    }

    getRenderItem({item}: Object) {
        switch (item.id) {
            case 0:
                return this.getPersonalCard();
            case 1:
                return this.getClubCard();
            case 2:
                return this.getMembershipCar();
        }
    }


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
                        <List.Item
                            title={this.getFieldValue(this.data.birthday)}
                            left={props => <List.Icon {...props} icon="cake-variant"/>}
                        />
                        <List.Item
                            title={this.getFieldValue(this.data.phone)}
                            left={props => <List.Icon {...props} icon="phone"/>}
                        />
                        <List.Item
                            title={this.getFieldValue(this.data.email)}
                            left={props => <List.Icon {...props} icon="email"/>}
                        />
                        <List.Item
                            title={this.getFieldValue(this.data.branch)}
                            left={props => <List.Icon {...props} icon="school"/>}
                        />
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

    getFieldValue(field: ?string) {
        return field !== null
            ? field
            : i18n.t("profileScreen.noData");
    }

    render() {
        return (
            <AuthenticatedScreen
                {...this.props}
                link={'https://www.amicale-insat.fr/api/user/profile'}
                renderFunction={(data) => this.getScreen(data)}
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

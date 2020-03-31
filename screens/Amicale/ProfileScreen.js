import * as React from 'react';
import {ScrollView, StyleSheet} from "react-native";
import {Avatar, Button, Card, Divider, List, withTheme} from 'react-native-paper';
import AuthenticatedScreen from "../../components/AuthenticatedScreen";
import {openBrowser} from "../../utils/WebBrowser";

type Props = {
    navigation: Object,
    theme: Object,
}

type State = {}

class ProfileScreen extends React.Component<Props, State> {

    state = {};

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    getScreen(data: Object) {
        console.log(data);
        return (
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Title
                        title={data.first_name + ' ' + data.last_name}
                        subtitle={data.email}
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
                            <List.Subheader>INFORMATIONS PERSONNELLES</List.Subheader>
                            <List.Item
                                title={this.getFieldValue(data.birthday)}
                                left={props => <List.Icon {...props} icon="cake-variant"/>}
                            />
                            <List.Item
                                title={this.getFieldValue(data.phone)}
                                left={props => <List.Icon {...props} icon="phone"/>}
                            />
                            <List.Item
                                title={this.getFieldValue(data.email)}
                                left={props => <List.Icon {...props} icon="email"/>}
                            />
                            <List.Item
                                title={this.getFieldValue(data.branch)}
                                left={props => <List.Icon {...props} icon="school"/>}
                            />
                        </List.Section>
                        <Divider/>
                        <Card.Actions>
                            <Button
                                icon="account-edit"
                                mode="contained"
                                onPress={() => openBrowser(data.link, this.colors.primary)}
                                style={styles.editButton}>
                                EDITER INFOS
                            </Button>
                        </Card.Actions>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <List.Section>
                            <List.Subheader>ETAT COTISATION</List.Subheader>
                            {this.getMembershipItem(data.validity)}
                        </List.Section>
                    </Card.Content>
                </Card>
            </ScrollView>
        )
    }

    getMembershipItem(state: boolean) {
        return (
            <List.Item
                title={state ? 'PAYÉ' : 'NON PAYÉ'}
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
            : 'NON RENSEIGNÉ';
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

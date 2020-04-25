// @flow

import * as React from 'react';
import {ScrollView, View} from 'react-native';
import {Avatar, Button, Card, Chip, Paragraph, withTheme} from 'react-native-paper';
import ImageModal from 'react-native-image-modal';
import i18n from "i18n-js";
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";
import CustomHTML from "../../../components/Overrides/CustomHTML";
import CustomTabBar from "../../../components/Tabbar/CustomTabBar";
import type {category, club} from "./ClubListScreen";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {Linking} from "expo";
import {ERROR_TYPE} from "../../../utils/WebData";

type Props = {
    navigation: StackNavigationProp,
    route: {
        params?: {
            data?: club,
            categories?: Array<category>,
            clubId?: number,
        }, ...
    },
    theme: CustomTheme
};

type State = {
    imageModalVisible: boolean,
};

const AMICALE_MAIL = "clubs@amicale-insat.fr";

/**
 * Class defining a club event information page.
 * If called with data and categories navigation parameters, will use those to display the data.
 * If called with clubId parameter, will fetch the information on the server
 */
class ClubDisplayScreen extends React.Component<Props, State> {

    displayData: club | null;
    categories: Array<category> | null;
    clubId: number;

    shouldFetchData: boolean;

    state = {
        imageModalVisible: false,
    };

    constructor(props) {
        super(props);
        if (this.props.route.params != null) {
            if (this.props.route.params.data != null && this.props.route.params.categories != null) {
                this.displayData = this.props.route.params.data;
                this.categories = this.props.route.params.categories;
                this.clubId = this.props.route.params.data.id;
                this.shouldFetchData = false;
            } else if (this.props.route.params.clubId != null) {
                this.displayData = null;
                this.categories = null;
                this.clubId = this.props.route.params.clubId;
                this.shouldFetchData = true;
            }
        }
    }

    getCategoryName(id: number) {
        if (this.categories !== null) {
            for (let i = 0; i < this.categories.length; i++) {
                if (id === this.categories[i].id)
                    return this.categories[i].name;
            }
        }
        return "";
    }

    getCategoriesRender(categories: [number, number]) {
        if (this.categories === null)
            return null;

        let final = [];
        for (let i = 0; i < categories.length; i++) {
            let cat = categories[i];
            if (cat !== null) {
                final.push(
                    <Chip
                        style={{marginRight: 5}}
                        key={i.toString()}>
                        {this.getCategoryName(cat)}
                    </Chip>
                );
            }
        }
        return <View style={{flexDirection: 'row', marginTop: 5}}>{final}</View>;
    }

    getManagersRender(resp: Array<string>, email: string | null) {
        let final = [];
        for (let i = 0; i < resp.length; i++) {
            final.push(<Paragraph key={i.toString()}>{resp[i]}</Paragraph>)
        }
        const hasManagers = resp.length > 0;
        return (
            <Card style={{marginTop: 10, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                <Card.Title
                    title={i18n.t('clubs.managers')}
                    subtitle={hasManagers ? i18n.t('clubs.managersSubtitle') : i18n.t('clubs.managersUnavailable')}
                    left={(props) => <Avatar.Icon
                        {...props}
                        style={{backgroundColor: 'transparent'}}
                        color={hasManagers ? this.props.theme.colors.success : this.props.theme.colors.primary}
                        icon="account-tie"/>}
                />
                <Card.Content>
                    {final}
                    {this.getEmailButton(email, hasManagers)}
                </Card.Content>
            </Card>
        );
    }

    getEmailButton(email: string | null, hasManagers: boolean) {
        const destinationEmail = email != null && hasManagers
            ? email
            : AMICALE_MAIL;
        const text = email != null && hasManagers
            ? i18n.t("clubs.clubContact")
            : i18n.t("clubs.amicaleContact");
        return (
            <Card.Actions>
                <Button
                    icon="email"
                    mode="contained"
                    onPress={() => Linking.openURL('mailto:' + destinationEmail)}
                    style={{marginLeft: 'auto'}}
                >
                    {text}
                </Button>
            </Card.Actions>
        );
    }

    updateHeaderTitle(data: Object) {
        this.props.navigation.setOptions({title: data.name})
    }

    getScreen = (response: Array<Object>) => {
        let data: club = response[0];
        this.updateHeaderTitle(data);
        if (data != null) {
            return (
                <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
                    {this.getCategoriesRender(data.category)}
                    {data.logo !== null ?
                        <View style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: 10,
                            marginBottom: 10,
                        }}>
                            <ImageModal
                                resizeMode="contain"
                                imageBackgroundColor={this.props.theme.colors.background}
                                style={{
                                    width: 300,
                                    height: 300,
                                }}
                                source={{
                                    uri: data.logo,
                                }}
                            />
                        </View>
                        : <View/>}

                    {data.description !== null ?
                        // Surround description with div to allow text styling if the description is not html
                        <Card.Content>
                            <CustomHTML html={data.description}/>
                        </Card.Content>
                        : <View/>}
                    {this.getManagersRender(data.responsibles, data.email)}
                </ScrollView>
            );
        } else
            return null;

    };

    render() {
        if (this.shouldFetchData)
            return <AuthenticatedScreen
                {...this.props}
                requests={[
                    {
                        link: 'clubs/info',
                        params: {'id': this.clubId},
                        mandatory: true
                    }
                ]}
                renderFunction={this.getScreen}
                errorViewOverride={[
                    {
                        errorCode: ERROR_TYPE.BAD_INPUT,
                        message: i18n.t("clubs.invalidClub"),
                        icon: "account-question",
                        showRetryButton: false
                    }
                ]}
            />;
        else
            return this.getScreen([this.displayData]);
    }
}

export default withTheme(ClubDisplayScreen);

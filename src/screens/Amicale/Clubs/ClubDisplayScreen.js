// @flow

import * as React from 'react';
import {Linking, View} from 'react-native';
import {Avatar, Button, Card, Chip, Paragraph, withTheme} from 'react-native-paper';
import ImageModal from 'react-native-image-modal';
import i18n from "i18n-js";
import AuthenticatedScreen from "../../../components/Amicale/AuthenticatedScreen";
import CustomHTML from "../../../components/Overrides/CustomHTML";
import CustomTabBar from "../../../components/Tabbar/CustomTabBar";
import type {category, club} from "./ClubListScreen";
import type {CustomTheme} from "../../../managers/ThemeManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {ERROR_TYPE} from "../../../utils/WebData";
import CollapsibleScrollView from "../../../components/Collapsible/CollapsibleScrollView";

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

    /**
     * Gets the name of the category with the given ID
     *
     * @param id The category's ID
     * @returns {string|*}
     */
    getCategoryName(id: number) {
        if (this.categories !== null) {
            for (let i = 0; i < this.categories.length; i++) {
                if (id === this.categories[i].id)
                    return this.categories[i].name;
            }
        }
        return "";
    }

    /**
     * Gets the view for rendering categories
     *
     * @param categories The categories to display (max 2)
     * @returns {null|*}
     */
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

    /**
     * Gets the view for rendering club managers if any
     *
     * @param managers The list of manager names
     * @param email The club contact email
     * @returns {*}
     */
    getManagersRender(managers: Array<string>, email: string | null) {
        let managersListView = [];
        for (let i = 0; i < managers.length; i++) {
            managersListView.push(<Paragraph key={i.toString()}>{managers[i]}</Paragraph>)
        }
        const hasManagers = managers.length > 0;
        return (
            <Card style={{marginTop: 10, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
                <Card.Title
                    title={i18n.t('screens.clubs.managers')}
                    subtitle={hasManagers ? i18n.t('screens.clubs.managersSubtitle') : i18n.t('screens.clubs.managersUnavailable')}
                    left={(props) => <Avatar.Icon
                        {...props}
                        style={{backgroundColor: 'transparent'}}
                        color={hasManagers ? this.props.theme.colors.success : this.props.theme.colors.primary}
                        icon="account-tie"/>}
                />
                <Card.Content>
                    {managersListView}
                    {this.getEmailButton(email, hasManagers)}
                </Card.Content>
            </Card>
        );
    }

    /**
     * Gets the email button to contact the club, or the amicale if the club does not have any managers
     *
     * @param email The club contact email
     * @param hasManagers True if the club has managers
     * @returns {*}
     */
    getEmailButton(email: string | null, hasManagers: boolean) {
        const destinationEmail = email != null && hasManagers
            ? email
            : AMICALE_MAIL;
        const text = email != null && hasManagers
            ? i18n.t("screens.clubs.clubContact")
            : i18n.t("screens.clubs.amicaleContact");
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

    /**
     * Updates the header title to match the given club
     *
     * @param data The club data
     */
    updateHeaderTitle(data: club) {
        this.props.navigation.setOptions({title: data.name})
    }

    getScreen = (response: Array<{ [key: string]: any } | null>) => {
        let data: club | null = null;
        if (response[0] != null) {
            data = response[0];
            this.updateHeaderTitle(data);
        }
        if (data != null) {
            return (
                <CollapsibleScrollView
                    style={{paddingLeft: 5, paddingRight: 5}}
                    hasTab={true}
                >
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
                </CollapsibleScrollView>
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
                        message: i18n.t("screens.clubs.invalidClub"),
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

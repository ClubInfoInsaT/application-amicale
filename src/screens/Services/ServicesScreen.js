// @flow

import * as React from 'react';
import type {cardList} from "../../components/Lists/CardList/CardList";
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {Animated, Image, View} from "react-native";
import {Avatar, Card, Divider, List, TouchableRipple, withTheme} from "react-native-paper";
import type {CustomTheme} from "../../managers/ThemeManager";
import i18n from 'i18n-js';
import MaterialHeaderButtons, {Item} from "../../components/Overrides/CustomHeaderButton";
import ConnectionManager from "../../managers/ConnectionManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {MASCOT_STYLE} from "../../components/Mascot/Mascot";
import MascotPopup from "../../components/Mascot/MascotPopup";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import ServicesManager from "../../managers/ServicesManager";

type Props = {
    navigation: StackNavigationProp,
    collapsibleStack: Collapsible,
    theme: CustomTheme,
}

type State = {
    mascotDialogVisible: boolean,
}


export type listItem = {
    title: string,
    description: string,
    image: string | number,
    content: cardList,
}

const AMICALE_LOGO = require("../../../assets/amicale.png");

class ServicesScreen extends React.Component<Props, State> {

    amicaleDataset: cardList;
    studentsDataset: cardList;
    insaDataset: cardList;

    finalDataset: Array<listItem>

    state = {
        mascotDialogVisible: AsyncStorageManager.getInstance().preferences.servicesShowBanner.current === "1"
    }

    constructor(props) {
        super(props);
        const services = new ServicesManager(props.navigation);
        this.amicaleDataset = services.getAmicaleServices();
        this.studentsDataset = services.getStudentServices();
        this.insaDataset = services.getINSAServices();
        this.finalDataset = [
            {
                title: i18n.t("screens.services.categories.amicale"),
                description: i18n.t("screens.services.more"),
                image: AMICALE_LOGO,
                content: this.amicaleDataset
            },
            {
                title: i18n.t("screens.services.categories.students"),
                description: i18n.t("screens.services.more"),
                image: 'account-group',
                content: this.studentsDataset
            },
            {
                title: i18n.t("screens.services.categories.insa"),
                description: i18n.t("screens.services.more"),
                image: 'school',
                content: this.insaDataset
            },
        ];
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.getAboutButton,
        });
    }


    /**
     * Callback used when closing the banner.
     * This hides the banner and saves to preferences to prevent it from reopening
     */
    onHideMascotDialog = () => {
        this.setState({mascotDialogVisible: false});
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.servicesShowBanner.key,
            '0'
        );
    };

    getAboutButton = () =>
        <MaterialHeaderButtons>
            <Item title="information" iconName="information" onPress={this.onAboutPress}/>
        </MaterialHeaderButtons>;

    onAboutPress = () => this.props.navigation.navigate('amicale-contact');

    /**
     * Gets the list title image for the list.
     *
     * If the source is a string, we are using an icon.
     * If the source is a number, we are using an internal image.
     *
     * @param props Props to pass to the component
     * @param source The source image to display. Can be a string for icons or a number for local images
     * @returns {*}
     */
    getListTitleImage(props, source: string | number) {
        if (typeof source === "number")
            return <Image
                size={48}
                source={source}
                style={{
                    width: 48,
                    height: 48,
                }}/>
        else
            return <Avatar.Icon
                {...props}
                size={48}
                icon={source}
                color={this.props.theme.colors.primary}
                style={{backgroundColor: 'transparent'}}
            />
    }

    /**
     * Redirects to the given route or to the login screen if user is not logged in.
     *
     * @param route The route to navigate to
     */
    onAmicaleServicePress(route: string) {
        if (ConnectionManager.getInstance().isLoggedIn())
            this.props.navigation.navigate(route);
        else
            this.props.navigation.navigate("login", {nextScreen: route});
    }

    /**
     * A list item showing a list of available services for the current category
     *
     * @param item
     * @returns {*}
     */
    renderItem = ({item}: { item: listItem }) => {
        return (
            <TouchableRipple
                style={{
                    margin: 5,
                    marginBottom: 20,
                }}
                onPress={() => this.props.navigation.navigate("services-section", {data: item})}
            >
                <View>
                    <Card.Title
                        title={item.title}
                        subtitle={item.description}
                        left={(props) => this.getListTitleImage(props, item.image)}
                        right={(props) => <List.Icon {...props} icon="chevron-right"/>}
                    />
                    <CardList
                        dataset={item.content}
                        isHorizontal={true}
                    />
                </View>
            </TouchableRipple>

        );
    };

    keyExtractor = (item: listItem) => {
        return item.title;
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <View>
                <Animated.FlatList
                    data={this.finalDataset}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onScroll={onScroll}
                    contentContainerStyle={{
                        paddingTop: containerPaddingTop,
                        paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
                    }}
                    scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
                    ItemSeparatorComponent={() => <Divider/>}
                />
                <MascotPopup
                    visible={this.state.mascotDialogVisible}
                    title={i18n.t("screens.services.mascotDialog.title")}
                    message={i18n.t("screens.services.mascotDialog.message")}
                    icon={"cloud-question"}
                    buttons={{
                        action: null,
                        cancel: {
                            message: i18n.t("screens.services.mascotDialog.button"),
                            icon: "check",
                            onPress: this.onHideMascotDialog,
                        }
                    }}
                    emotion={MASCOT_STYLE.WINK}
                />
            </View>
        );
    }
}

export default withCollapsible(withTheme(ServicesScreen));

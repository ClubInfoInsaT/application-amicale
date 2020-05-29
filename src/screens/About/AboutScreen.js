// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, View} from 'react-native';
import i18n from "i18n-js";
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import {Avatar, Card, List, Title, withTheme} from 'react-native-paper';
import packageJson from "../../../package.json";

const links = {
    appstore: 'https://apps.apple.com/us/app/campus-amicale-insat/id1477722148',
    playstore: 'https://play.google.com/store/apps/details?id=fr.amicaleinsat.application',
    git: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/README.md',
    changelog: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/Changelog.md',
    license: 'https://git.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/LICENSE',
    authorMail: "mailto:vergnet@etud.insa-toulouse.fr?" +
        "subject=" +
        "Application Amicale INSA Toulouse" +
        "&body=" +
        "Coucou !\n\n",
    authorLinkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    yohanMail: "mailto:ysimard@etud.insa-toulouse.fr?" +
        "subject=" +
        "Application Amicale INSA Toulouse" +
        "&body=" +
        "Coucou !\n\n",
    yohanLinkedin: 'https://www.linkedin.com/in/yohan-simard',
    react: 'https://facebook.github.io/react-native/',
};

type Props = {
    navigation: Object,
};

type State = {
    isDebugUnlocked: boolean,
};

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining an about screen. This screen shows the user information about the app and it's author.
 */
class AboutScreen extends React.Component<Props, State> {

    debugTapCounter = 0;
    modalRef: Object;

    state = {
        isDebugUnlocked: AsyncStorageManager.getInstance().preferences.debugUnlocked.current === '1'
    };
    /**
     * Data to be displayed in the app card
     */
    appData: Array<Object> = [
        {
            onPressCallback: () => openWebLink(Platform.OS === "ios" ? links.appstore : links.playstore),
            icon: Platform.OS === "ios" ? 'apple' : 'google-play',
            text: Platform.OS === "ios" ? i18n.t('aboutScreen.appstore') : i18n.t('aboutScreen.playstore'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate("feedback"),
            icon: 'bug',
            text: i18n.t("feedbackScreen.homeButtonTitle"),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.git),
            icon: 'git',
            text: 'Git',
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.changelog),
            icon: 'refresh',
            text: i18n.t('aboutScreen.changelog'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.license),
            icon: 'file-document',
            text: i18n.t('aboutScreen.license'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate('debug'),
            icon: 'bug-check',
            text: i18n.t('aboutScreen.debug'),
            showChevron: true,
            showOnlyInDebug: true
        },
    ];
    /**
     * Data to be displayed in the author card
     */
    authorData: Array<Object> = [
        {
            onPressCallback: () => this.tryUnlockDebugMode(),
            icon: 'account-circle',
            text: 'Arnaud VERGNET',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.authorMail),
            icon: 'email',
            text: i18n.t('aboutScreen.authorMail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.authorLinkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
    ];
    /**
     * Data to be displayed in the additional developer card
     */
    additionalDevData: Array<Object> = [
        {
            onPressCallback: () => console.log('Meme this'),
            icon: 'account',
            text: 'Yohan SIMARD',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.yohanMail),
            icon: 'email',
            text: i18n.t('aboutScreen.authorMail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.yohanLinkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
    ];
    /**
     * Data to be displayed in the technologies card
     */
    technoData: Array<Object> = [
        {
            onPressCallback: () => openWebLink(links.react),
            icon: 'react',
            text: i18n.t('aboutScreen.reactNative'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate('dependencies'),
            icon: 'developer-board',
            text: i18n.t('aboutScreen.libs'),
            showChevron: true
        },
    ];
    /**
     * Order of information cards
     */
    dataOrder: Array<Object> = [
        {
            id: 'app',
        },
        {
            id: 'team',
        },
        {
            id: 'techno',
        },
    ];


    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    /**
     * Gets the app icon
     * @param props
     * @return {*}
     */
    getAppIcon(props) {
        return (
            <Avatar.Image
                {...props}
                source={require('../../../assets/android.icon.png')}
                style={{backgroundColor: 'transparent'}}
            />
        );
    }

    /**
     * Extracts a key from the given item
     *
     * @param item The item to extract the key from
     * @return {string} The extracted key
     */
    keyExtractor(item: Object): string {
        return item.icon;
    }

    /**
     * Gets the app card showing information and links about the app.
     *
     * @return {*}
     */
    getAppCard() {
        return (
            <Card style={{marginBottom: 10}}>
                <Card.Title
                    title={"Campus"}
                    subtitle={packageJson.version}
                    left={this.getAppIcon}/>
                <Card.Content>
                    <FlatList
                        data={this.appData}
                        extraData={this.state.isDebugUnlocked}
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
    getTeamCard() {
        return (
            <Card style={{marginBottom: 10}}>
                <Card.Title
                    title={i18n.t('aboutScreen.team')}
                    left={(props) => <Avatar.Icon {...props} icon={'account-multiple'}/>}/>
                <Card.Content>
                    <Title>{i18n.t('aboutScreen.author')}</Title>
                    <FlatList
                        data={this.authorData}
                        keyExtractor={this.keyExtractor}
                        listKey={"1"}
                        renderItem={this.getCardItem}
                    />
                    <Title>{i18n.t('aboutScreen.additionalDev')}</Title>
                    <FlatList
                        data={this.additionalDevData}
                        keyExtractor={this.keyExtractor}
                        listKey={"2"}
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
    getTechnoCard() {
        return (
            <Card style={{marginBottom: 10}}>
                <Card.Content>
                    <Title>{i18n.t('aboutScreen.technologies')}</Title>
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
    getChevronIcon(props: Object) {
        return (
            <List.Icon {...props} icon={'chevron-right'}/>
        );
    }

    /**
     * Gets a custom list item icon
     *
     * @param item The item to show the icon for
     * @param props
     * @return {*}
     */
    getItemIcon(item: Object, props: Object) {
        return (
            <List.Icon {...props} icon={item.icon}/>
        );
    }

    /**
     * Get a clickable card item to be rendered inside a card.
     *
     * @returns {*}
     */
    getCardItem = ({item}: Object) => {
        let shouldShow = item === undefined
            || !item.showOnlyInDebug
            || (item.showOnlyInDebug && this.state.isDebugUnlocked);
        const getItemIcon = this.getItemIcon.bind(this, item);
        if (shouldShow) {
            if (item.showChevron) {
                return (
                    <List.Item
                        title={item.text}
                        left={getItemIcon}
                        right={this.getChevronIcon}
                        onPress={item.onPressCallback}
                    />
                );
            } else {
                return (
                    <List.Item
                        title={item.text}
                        left={getItemIcon}
                        onPress={item.onPressCallback}
                    />
                );
            }
        } else
            return null;
    };

    /**
     * Tries to unlock debug mode
     */
    tryUnlockDebugMode() {
        this.debugTapCounter = this.debugTapCounter + 1;
        if (this.debugTapCounter >= 4) {
            this.unlockDebugMode();
        }
    }

    /**
     * Unlocks debug mode
     */
    unlockDebugMode() {
        this.setState({isDebugUnlocked: true});
        let key = AsyncStorageManager.getInstance().preferences.debugUnlocked.key;
        AsyncStorageManager.getInstance().savePref(key, '1');
    }

    /**
     * Gets a card, depending on the given item's id
     *
     * @param item The item to show
     * @return {*}
     */
    getMainCard = ({item}: Object) => {
        switch (item.id) {
            case 'app':
                return this.getAppCard();
            case 'team':
                return this.getTeamCard();
            case 'techno':
                return this.getTechnoCard();
        }
        return <View/>;
    };

    render() {
        return (
            <FlatList
                style={{padding: 5}}
                data={this.dataOrder}
                renderItem={this.getMainCard}
            />
        );
    }
}

export default withTheme(AboutScreen);
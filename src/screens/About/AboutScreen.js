// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, View} from 'react-native';
import i18n from "i18n-js";
import {Avatar, Card, List, Title, withTheme} from 'react-native-paper';
import packageJson from "../../../package.json";
import {StackNavigationProp} from "@react-navigation/stack";
import CollapsibleFlatList from "../../components/Collapsible/CollapsibleFlatList";

type ListItem = {
    onPressCallback: () => void,
    icon: string,
    text: string,
    showChevron: boolean
};

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
    meme: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
};

type Props = {
    navigation: StackNavigationProp,
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
class AboutScreen extends React.Component<Props> {

    /**
     * Data to be displayed in the app card
     */
    appData = [
        {
            onPressCallback: () => openWebLink(Platform.OS === "ios" ? links.appstore : links.playstore),
            icon: Platform.OS === "ios" ? 'apple' : 'google-play',
            text: Platform.OS === "ios" ? i18n.t('screens.about.appstore') : i18n.t('screens.about.playstore'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate("feedback"),
            icon: 'bug',
            text: i18n.t("screens.feedback.homeButtonTitle"),
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
            text: i18n.t('screens.about.changelog'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.license),
            icon: 'file-document',
            text: i18n.t('screens.about.license'),
            showChevron: true
        },
    ];
    /**
     * Data to be displayed in the author card
     */
    authorData = [
        {
            onPressCallback: () => openWebLink(links.meme),
            icon: 'account-circle',
            text: 'Arnaud VERGNET',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.authorMail),
            icon: 'email',
            text: i18n.t('screens.about.authorMail'),
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
    additionalDevData = [
        {
            onPressCallback: () => console.log('Meme this'),
            icon: 'account',
            text: 'Yohan SIMARD',
            showChevron: false
        },
        {
            onPressCallback: () => openWebLink(links.yohanMail),
            icon: 'email',
            text: i18n.t('screens.about.authorMail'),
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
    technoData = [
        {
            onPressCallback: () => openWebLink(links.react),
            icon: 'react',
            text: i18n.t('screens.about.reactNative'),
            showChevron: true
        },
        {
            onPressCallback: () => this.props.navigation.navigate('dependencies'),
            icon: 'developer-board',
            text: i18n.t('screens.about.libs'),
            showChevron: true
        },
    ];
    /**
     * Order of information cards
     */
    dataOrder = [
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

    /**
     * Gets the app icon
     *
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
    keyExtractor(item: ListItem): string {
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
                    title={i18n.t('screens.about.team')}
                    left={(props) => <Avatar.Icon {...props} icon={'account-multiple'}/>}/>
                <Card.Content>
                    <Title>{i18n.t('screens.about.author')}</Title>
                    <FlatList
                        data={this.authorData}
                        keyExtractor={this.keyExtractor}
                        listKey={"1"}
                        renderItem={this.getCardItem}
                    />
                    <Title>{i18n.t('screens.about.additionalDev')}</Title>
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
                    <Title>{i18n.t('screens.about.technologies')}</Title>
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
    getChevronIcon(props) {
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
    getItemIcon(item: ListItem, props) {
        return (
            <List.Icon {...props} icon={item.icon}/>
        );
    }

    /**
     * Gets a clickable card item to be rendered inside a card.
     *
     * @returns {*}
     */
    getCardItem = ({item}: { item: ListItem }) => {
        const getItemIcon = this.getItemIcon.bind(this, item);
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
    };

    /**
     * Gets a card, depending on the given item's id
     *
     * @param item The item to show
     * @return {*}
     */
    getMainCard = ({item}: { item: { id: string } }) => {
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
            <CollapsibleFlatList
                style={{padding: 5}}
                data={this.dataOrder}
                renderItem={this.getMainCard}
            />
        );
    }
}

export default withTheme(AboutScreen);

// @flow

import * as React from 'react';
import {FlatList, Linking, Platform, View} from 'react-native';
import {Body, Card, CardItem, Container, Content, H1, Left, Right, Text, Thumbnail} from 'native-base';
import CustomHeader from "../../components/CustomHeader";
import i18n from "i18n-js";
import appJson from '../../app';
import packageJson from '../../package';
import CustomMaterialIcon from "../../components/CustomMaterialIcon";
import AsyncStorageManager from "../../utils/AsyncStorageManager";

const links = {
    appstore: 'https://apps.apple.com/us/app/campus-amicale-insat/id1477722148',
    playstore: 'https://play.google.com/store/apps/details?id=fr.amicaleinsat.application',
    expo: 'https://expo.io/@amicaleinsat/application-amicale',
    git: 'https://git.srv-falcon.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/README.md',
    bugs: 'https://git.srv-falcon.etud.insa-toulouse.fr/vergnet/application-amicale/issues',
    changelog: 'https://git.srv-falcon.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/Changelog.md',
    license: 'https://git.srv-falcon.etud.insa-toulouse.fr/vergnet/application-amicale/src/branch/master/LICENSE',
    mail: "mailto:vergnet@etud.insa-toulouse.fr?subject=Application Amicale INSA Toulouse&body=",
    linkedin: 'https://www.linkedin.com/in/arnaud-vergnet-434ba5179/',
    facebook: 'https://www.facebook.com/arnaud.vergnet',
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
export default class AboutScreen extends React.Component<Props, State> {

    debugTapCounter = 0;

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
            onPressCallback: () => openWebLink(links.expo),
            icon: 'worker',
            text: i18n.t('aboutScreen.expoBeta'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.git),
            icon: 'git',
            text: 'Git',
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.bugs),
            icon: 'bug',
            text: i18n.t('aboutScreen.bugs'),
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
            onPressCallback: () => this.props.navigation.navigate('DebugScreen'),
            icon: 'bug-check',
            text: i18n.t('aboutScreen.debug'),
            showChevron: true,
            showOnlyDebug: true
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
            onPressCallback: () => openWebLink(links.mail),
            icon: 'email',
            text: i18n.t('aboutScreen.mail'),
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.linkedin),
            icon: 'linkedin',
            text: 'Linkedin',
            showChevron: true
        },
        {
            onPressCallback: () => openWebLink(links.facebook),
            icon: 'facebook',
            text: 'Facebook',
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
            showChevron: false
        },
        {
            onPressCallback: () => this.props.navigation.navigate('AboutDependenciesScreen', {data: packageJson.dependencies}),
            icon: 'developer-board',
            text: i18n.t('aboutScreen.libs'),
            showChevron: true
        },
    ];

    /**
     * Get a clickable card item to be rendered inside a card.
     *
     * @param onPressCallback The callback to use when the item is clicked
     * @param icon The icon name to use from MaterialCommunityIcons
     * @param text The text to show
     * @param showChevron Whether to show a chevron indicating this button will change screen
     * @param showOnlyInDebug Should we show te current item only in debug mode?
     * @returns {React.Node}
     */
    getCardItem(onPressCallback: Function, icon: string, text: string, showChevron: boolean, showOnlyInDebug: boolean) {
        let shouldShow = !showOnlyInDebug || (showOnlyInDebug && this.state.isDebugUnlocked);
        if (shouldShow) {
            return (
                <CardItem button
                          onPress={onPressCallback}>
                    <Left>
                        <CustomMaterialIcon icon={icon}/>
                        <Text>{text}</Text>
                    </Left>
                    {showChevron ?
                        <Right>
                            <CustomMaterialIcon icon="chevron-right"
                                                fontSize={20}/>
                        </Right>
                        :
                        <Right/>
                    }
                </CardItem>)
                ;
        } else {
            return <View/>
        }

    }

    tryUnlockDebugMode() {
        this.debugTapCounter = this.debugTapCounter + 1;
        console.log(this.debugTapCounter);
        if (this.debugTapCounter >= 4) {
            this.unlockDebugMode();
        }
    }

    unlockDebugMode() {
        console.log('unlocked');
        this.setState({isDebugUnlocked: true});
        let key = AsyncStorageManager.getInstance().preferences.debugUnlocked.key;
        AsyncStorageManager.getInstance().savePref(key, '1');
    }

    render() {
        const nav = this.props.navigation;
        return (
            <Container>
                <CustomHeader navigation={nav} title={i18n.t('screens.about')} hasBackButton={true}/>
                <Content padder>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail square source={require('../../assets/icon.png')}/>
                                <Body>
                                    <H1>{appJson.expo.name}</H1>
                                    <Text note>
                                        v.{appJson.expo.version}
                                    </Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <FlatList
                            data={this.appData}
                            extraData={this.state}
                            keyExtractor={(item) => item.icon}
                            renderItem={({item}) =>
                                this.getCardItem(item.onPressCallback, item.icon, item.text, item.showChevron, item.showOnlyDebug)
                            }
                        />
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('aboutScreen.author')}</Text>
                        </CardItem>
                        <FlatList
                            data={this.authorData}
                            extraData={this.state}
                            keyExtractor={(item) => item.icon}
                            renderItem={({item}) =>
                                this.getCardItem(item.onPressCallback, item.icon, item.text, item.showChevron, item.showOnlyDebug)
                            }
                        />
                    </Card>

                    <Card>
                        <CardItem header>
                            <Text>{i18n.t('aboutScreen.technologies')}</Text>
                        </CardItem>
                        <FlatList
                            data={this.technoData}
                            extraData={this.state}
                            keyExtractor={(item) => item.icon}
                            renderItem={({item}) =>
                                this.getCardItem(item.onPressCallback, item.icon, item.text, item.showChevron, item.showOnlyDebug)
                            }
                        />
                    </Card>
                </Content>
            </Container>
        );
    }
}
